"use strict";

const mongoose = require("mongoose");
const { userAction } = require("../models/user.action.model");
const { post } = require("../models/post.model");
const { comment } = require("../models/comment.model");
const cosineSimilarity = require('cosine-similarity');

// Constants for weights and time decay
const WEIGHTS = {
    view: 1,
    like: 2,
    comment: 3,
    share: 4,
    click: 5
};

const TIME_DECAY_FACTOR = 0.9; // Decay factor for older interactions

// Generate Multi-Dimensional Behavior Vector
async function generateBehaviorVector(userId) {
    try {
        const actions = await userAction.find({ userId }).exec();
        const userComments = await comment.find({ userId }).exec();
        const userPosts = await post.find({ author: userId }).exec();
        
        const currentTime = Date.now();
        const initialVector = {
            view: 0,
            like: 0,
            comment: 0,
            share: 0,
            click: 0,
            totalTimeSpent: 0, // Total time spent on posts
            interactionFrequency: 0, // Number of interactions per day
            recentInteraction: 0, // Timestamp of the most recent interaction
            frequentInteractions: new Map() // Track interactions with other users
        };

        for (const { actionType, postId, timestamps, metadata } of actions) {
            const actionAgeInDays = (currentTime - new Date(timestamps).getTime()) / (1000 * 60 * 60 * 24);
            const timeDecay = Math.pow(TIME_DECAY_FACTOR, actionAgeInDays);
            
            initialVector[actionType] += WEIGHTS[actionType] * timeDecay;
            
            if (metadata && metadata.get('timeSpent')) {
                initialVector.totalTimeSpent += parseFloat(metadata.get('timeSpent')) * timeDecay;
            }

            initialVector.interactionFrequency += 1 / (actionAgeInDays + 1); // More recent interactions count more

            if (new Date(timestamps).getTime() > initialVector.recentInteraction) {
                initialVector.recentInteraction = new Date(timestamps).getTime();
            }

            const postAuthor = await post.findById(postId).select('author').exec();
            if (postAuthor && postAuthor.author !== userId) {
                initialVector.frequentInteractions.set(postAuthor.author, 
                    (initialVector.frequentInteractions.get(postAuthor.author) || 0) + timeDecay);
            }
        }

        // Include comments on user's posts
        for (const userPost of userPosts) {
            const postComments = await comment.find({ postId: userPost._id }).exec();
            for (const { userId: commenterId, createdAt } of postComments) {
                const actionAgeInDays = (currentTime - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
                const timeDecay = Math.pow(TIME_DECAY_FACTOR, actionAgeInDays);
                initialVector.frequentInteractions.set(commenterId, 
                    (initialVector.frequentInteractions.get(commenterId) || 0) + timeDecay);
            }
        }

        // Include user's comments on other posts
        for (const userComment of userComments) {
            const postAuthor = await post.findById(userComment.postId).select('author').exec();
            if (postAuthor && postAuthor.author !== userId) {
                const actionAgeInDays = (currentTime - new Date(userComment.createdAt).getTime()) / (1000 * 60 * 60 * 24);
                const timeDecay = Math.pow(TIME_DECAY_FACTOR, actionAgeInDays);
                initialVector.frequentInteractions.set(postAuthor.author, 
                    (initialVector.frequentInteractions.get(postAuthor.author) || 0) + timeDecay);
            }
        }

        return [
            initialVector.view,
            initialVector.like,
            initialVector.comment,
            initialVector.share,
            initialVector.click,
            initialVector.totalTimeSpent,
            initialVector.interactionFrequency,
            initialVector.recentInteraction,
            initialVector.frequentInteractions
        ];
    } catch (error) {
        console.error("Error generating behavior vector:", error);
        throw error;
    }
}

// Calculate similarity score based on cosine similarity
function calculateCosineSimilarity(behaviorVector, contentVector) {
    return cosineSimilarity(behaviorVector, contentVector);
}

// Predict interaction score based on time series data
function timeSeriesPrediction(actions) {
    const currentTime = Date.now();
    const timeDecaySum = actions.reduce((sum, action) => {
        const actionAgeInDays = (currentTime - new Date(action.timestamps).getTime()) / (1000 * 60 * 60 * 24);
        return sum + Math.pow(TIME_DECAY_FACTOR, actionAgeInDays);
    }, 0);
    return timeDecaySum / actions.length; // Average decayed score
}

// Hybrid Recommendation using Cosine Similarity, Time Series Prediction, and Interaction Frequency
async function recommendPosts(userId) {
    const [
        view, like, comment, share, click, 
        totalTimeSpent, interactionFrequency, 
        recentInteraction, frequentInteractions
    ] = await generateBehaviorVector(userId);

    const behaviorVector = [
        view, like, comment, share, click, 
        totalTimeSpent, interactionFrequency, 
        recentInteraction
    ];

    const posts = await post.find().exec();
    let scoredPosts = [];

    for (const content of posts) {
        // Placeholder content vector (in practice, this would come from content features like text embeddings, etc.)
        const contentVector = [content.likes.length, content.comments.length, content.share.length, 0, 0, 0, 0, 0];

        const similarityScore = calculateCosineSimilarity(behaviorVector, contentVector);

        const userActions = await userAction.find({ userId, postId: content._id }).exec();
        const timeSeriesScore = timeSeriesPrediction(userActions);

        // Additional score based on frequent interactions with the post author
        const interactionScore = frequentInteractions.get(content.author) || 0;

        const finalScore = (similarityScore + timeSeriesScore + interactionScore) / 3; // Combine scores
        scoredPosts.push({ content, score: finalScore });
    }

    scoredPosts.sort((a, b) => b.score - a.score); // Sort by score descending
    return scoredPosts.slice(0, 10); // Return top 10 recommendations
}

// Main function to analyze, reduce, and recommend
async function analyzeAndRecommend(userId) {
    const recommendations = await recommendPosts(userId);
    console.log(`Recommended posts for user ${userId}:`, recommendations.map(r => r.content));
    return recommendations;
}

module.exports = { analyzeAndRecommend };
