const assert = require('assert');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { connectToDatabase, addUser, authenticate } = require('./hash'); 

describe('User Authentication', function() {
    before(async function() {
        await connectToDatabase();
    });

    beforeEach(async function() {
        await mongoose.connection.dropDatabase();
    });

    describe('addUser', function() {
        it('should add a user to the database', async function() {
            const username = 'testUser';
            const password = 'testPassword';

            await addUser(username, password);

            const user = await User.findOne({ username });
            assert.ok(user, 'Користувач не був доданий до бази даних');
        });

        it('should throw an error if user already exists', async function() {
            const username = 'existingUser';
            const password = 'existingPassword';

            await addUser(username, password);

            await assert.rejects(
                addUser(username, 'anotherPassword'),
                { name: 'Error', message: "Користувач з таким ім'ям вже існує." }
            );
        });
    });

    describe('authenticate', function() {
        it('should authenticate user with correct password', async function() {
            const username = 'authUser';
            const password = 'authPassword';

            await addUser(username, password);

            await authenticate(username, password);
        });

        it('should throw an error if user does not exist', async function() {
            const username = 'nonexistentUser';
            const password = 'nonexistentPassword';

            await assert.rejects(
                authenticate(username, password),
                { name: 'Error', message: 'Користувач не знайдений.' }
            );
        });

        it('should throw an error if password is incorrect', async function() {
            const username = 'authUser';
            const correctPassword = 'correctPassword';
            const incorrectPassword = 'incorrectPassword';

            await addUser(username, correctPassword);

            await assert.rejects(
                authenticate(username, incorrectPassword),
                { name: 'Error', message: 'Пароль не співпадає.' }
            );
        });
    });
});
