const { BadRequestError } = require("../core/error.response");
const client = require("../db/init.redis");
const friendList = require("../models/friendList");
const searchHistoryModel = require("../models/searchHistory.model");
const { user } = require("../models/user.model");
const { DictionaryFactory } = require("../predictive-text/factory");
const RedisService = require("./redis.service");

class SearchService {
    // satic searchUser = async (query) => {
    //     const cachedResult = await new Promise((resolve, reject) => {
    //         client.get(String(query), (err, result) => {
    //             if (err) return reject(err);
    //             resolve(result ? JSON.parse(result) : null);
    //         });
    //     });

    //     if (query) {
    //         return query;
    //     }
    //     console.log("users",users);

    //     const users = await user.find({}).select('_id firstName lastName email avatar'); // Fetch only necessary fields
    //     console.log("users",users);

    //     const words = users.map(user => user.firstName)
    //                        .concat(users.map(user => user.lastName))
    //                        .concat(users.map(user => user.email));

    //     const dictionary = DictionaryFactory.createDictionary("Trie", words);
    //     const regex = new RegExp(query, "i");
    //     console.log("dictionary",dictionary);

    //     const foundUser = users.filter(user => {
    //         const firstNameMatch = user.firstName.match(regex);
    //         const lastNameMatch = user.lastName.match(regex);
    //         const emailMatch = user.email.match(regex);
            
    //         return (firstNameMatch && dictionary.contains(firstNameMatch[0])) ||
    //                (lastNameMatch && dictionary.contains(lastNameMatch[0])) ||
    //                (emailMatch && dictionary.contains(emailMatch[0]));
    //     }).slice(0, 8); // limit to 8 results

    //     client.set(String(query), JSON.stringify(foundUser), 'EX', 3600); // cache result for 1 hour
    //     console.log("foundUser",foundUser);
    //     return foundUser;   
    // }
    static searchHistoryOfUser = async ({ userId, searchedUserId }) => {
        let searchHistory = await searchHistoryModel.findOne({ user: userId });
      
        if (!searchHistory) {
          searchHistory = await searchHistoryModel.create({
            user: userId,
            searchedUsers: [],
          });
        }
      
        const existingUserIndex = searchHistory.searchedUsers.findIndex(
          (item) => item.user.toString() === searchedUserId
        );
      
        if (existingUserIndex !== -1) {
          searchHistory.searchedUsers[existingUserIndex].searchedAt = Date.now();
        } else {
          searchHistory.searchedUsers.push({ user: searchedUserId });
        }
      
        await searchHistory.save();
      
        const updatedSearchHistory = searchHistory.searchedUsers.slice(-8); // Return max 8 users
      
        // Update Redis with the new search history
        const populatedSearchHistory = await searchHistoryModel
          .findOne({ user: userId })
          .populate({
            path: "searchedUsers.user",
            select: "_id firstName lastName avatar",
          })
          .exec();
      
        const formattedSearchHistory = populatedSearchHistory.searchedUsers
          .filter((searchedUser) => searchedUser.user)
          .map((searchedUser) => ({
            _id: searchedUser.user._id,
            firstName: searchedUser.user.firstName,
            lastName: searchedUser.user.lastName,
            avatar: searchedUser.user.avatar,
          }));
      
        await RedisService.handlePostSearch({
          userId,
          searchParams: formattedSearchHistory.slice(-8),
        });
      
        return updatedSearchHistory;
      };
      
    
      static getSearchHistoryOfUser = async (userId) => {
        const data = await RedisService.handleGetSearch(userId);
      
        // Check if data is null or undefined
        if (!data) {
          // If no data in Redis, fetch from MongoDB
          const searchHistory = await searchHistoryModel
            .findOne({ user: userId })
            .populate({
              path: "searchedUsers.user",
              select: "_id firstName lastName avatar",
            })
            .exec();
      
          if (!searchHistory) {
            throw new BadRequestError("No search history found");
          }
      
          let formattedSearchHistory = [];
          if (
            searchHistory.searchedUsers &&
            Array.isArray(searchHistory.searchedUsers)
          ) {
            formattedSearchHistory = searchHistory.searchedUsers
              .filter((searchedUser) => searchedUser.user)
              .map((searchedUser) => ({
                _id: searchedUser.user._id,
                firstName: searchedUser.user.firstName,
                lastName: searchedUser.user.lastName,
                avatar: searchedUser.user.avatar,
              }));
          }
      
          const dataSearchHistory = formattedSearchHistory.slice(-8); // Return max 8 users
      
          // Save to Redis for future requests
          await RedisService.handlePostSearch({ userId, searchParams: dataSearchHistory });
          return dataSearchHistory;
        }
        return data;
      };
      
    static searchUser = async ({ query, currentUserId }) => {
      const keywords = query.split(" ").filter(Boolean);
    
      const regexConditions = keywords.map((keyword) => ({
          $or: [
              { firstName: { $regex: new RegExp(keyword, "i") } },
              { lastName: { $regex: new RegExp(keyword, "i") } },
              { email: { $regex: new RegExp(keyword, "i") } },
          ],
      }));
    
      const foundUsers = await user
          .find({
              $and: regexConditions,
          })
          .select("_id firstName lastName avatar")
          .limit(8)
          .lean();
      
      const friendLists = await friendList.findOne({ user: currentUserId });
    
      const usersWithFriendStatus = foundUsers.map((foundUser) => ({
          ...foundUser,
          isFriend: friendLists
              ? friendLists.friends.includes(foundUser._id)
              : false,
      }));
    
      return usersWithFriendStatus.slice(0, 8); // Trả về tối đa 8 user
      };
    
    
      static removeUserFromSearch = async ({ user, searchedUsers }) => {
        const query = { user: user };
        const updateSet = {
            $pull: {
                searchedUsers: {
                    user: searchedUsers,
                },
            },
        };
        const updateSearch = await searchHistoryModel.updateOne(query, updateSet);
        if (!updateSearch) {
            throw new BadRequestError("Cannot update search");
        }
        
        const updatedSearchHistory = await searchHistoryModel.findOne(query).limit(8);
        
        // Đảm bảo chỉ trả về tối đa 8 user sau khi cập nhật
        updatedSearchHistory.searchedUsers = updatedSearchHistory.searchedUsers.slice(-8);
        await updatedSearchHistory.save();
        
        return updatedSearchHistory.searchedUsers.slice(-8);
    };
}

module.exports = SearchService;
