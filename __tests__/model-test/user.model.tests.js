import { jest } from '@jest/globals';
import SequelizeMock from 'sequelize-mock';
import User from '../../app/models/user.model.js';

// Create Sequelize instance for mocks
const dbMock = new SequelizeMock();

dbMock.sync = () => Promise.resolve();
dbMock.close = () => Promise.resolve();

jest.mock('../../app/sequelizeUtils/sequelizeInstance.js', () => dbMock);

describe('User Model Tests', () => {
  beforeAll(async () => {
    await dbMock.sync({ force: true });
  });

  afterAll(async () => {
    await dbMock.close();
  });

  it('should create a user successfully', async () => {
    // data you want to enter
    const userData = {
      fName: 'John',
      lName: 'Doe',
      email: 'john.doe@example.com',
    };

    const user = await User.create(userData);

    // assertions expect(x).toBe(y) is the basic one. 
    expect(user.id).toBeDefined();
    expect(user.fName).toBe(userData.fName);
    expect(user.lName).toBe(userData.lName);
    expect(user.email).toBe(userData.email);
    
  });

  it('should not create a user without an email', async () => {
    try {
      await User.create({
        fName: 'Jane',
        lName: 'Doe',
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('SequelizeValidationError');
    }
  });

  it('should not create a user with a duplicate email', async () => {
    const userData = {
      fName: 'Alice',
      lName: 'Smith',
      email: 'alice.smith@example.com',
    };

    await User.create(userData);

    try {
      await User.create({
        fName: 'Bob',
        lName: 'Johnson',
        email: 'alice.smith@example.com', // SAme email from above
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('SequelizeUniqueConstraintError');
    }
  });
});