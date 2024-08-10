const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { user } = require('../../models/user.model');

describe('User Model', () => {
  let newUser;

  // Setup sample user data before each test
  beforeEach(() => {
    newUser = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: 'password123',
      phoneNumber: faker.phone.number(),
      address: faker.location.streetAddress(),
      gender: 'male',
      avatar: faker.image.avatar(),
      savePosts: [],
      work: [
        {
          nameOfCompany: faker.company.name(),
          position: faker.person.jobTitle(),
          yearStart: 2015,
          yearEnd: 2020,
          visibility: 'public',
        },
      ],
      universities: [
        {
          name: faker.company.name() + ' University',
          yearStart: 2010,
          yearEnd: 2014,
          specialized: 'Computer Science',
          visibility: 'public',
        },
      ],
      highSchools: [
        {
          name: faker.company.name() + ' High School',
          yearStart: 2006,
          yearEnd: 2009,
          visibility: 'public',
        },
      ],
      currentCity: {
        name: faker.location.city(),
        visibility: 'public',
      },
      oldCity: {
        name: faker.location.city(),
        visibility: 'friend',
      },
      socialLinks: [
        {
          type: 'github',
          link: faker.internet.url(),
          visibility: 'public',
        },
      ],
      dateOfBirth: {
        birthDate: '16 tháng 3',
        birthYear: 1990,
        visibility: 'public',
      },
    };
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('should correctly validate a valid user', async () => {
    await expect(new user(newUser).validate()).resolves.toBeUndefined();
  });

  test('should throw a validation error if required fields are missing', async () => {
    delete newUser.firstName;
    await expect(new user(newUser).validate()).rejects.toThrow();
  });

  test('should throw a validation error if email is not unique', async () => {
    const user1 = new user(newUser);
    const user2 = new user(newUser);
      
    await user1.save();
    await expect(user2.save()).rejects.toThrow();
  }, 20000); // Increased timeout to 10 seconds

  test('should throw a validation error if gender is not valid', async () => {
    newUser.gender = 'invalid-gender';
    await expect(new user(newUser).validate()).rejects.toThrow();
  });

  test('should throw a validation error if visibility is not valid for work', async () => {
    newUser.work[0].visibility = 'invalid-visibility';
    await expect(new user(newUser).validate()).rejects.toThrow();
  });

  test('should throw a validation error if social link type is not valid', async () => {
    newUser.socialLinks[0].type = 'invalid-type';
    await expect(new user(newUser).validate()).rejects.toThrow();
  });
});
