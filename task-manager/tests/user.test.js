const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user-model');
const {userOneId ,userOne, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

afterEach(() => {
    console.log("afterEach") 
});

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Oscar',
        email: "oscar@example.com",
        password: "MyPass777!"
    }).expect(201);

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Oscar',
            email: "oscar@example.com"
        },
        token: user.tokens[0].token
    });

});

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
    const user = await User.findById(userOne);
    expect(response.body.token).toBe(user.tokens[1].token)
});

test('Should login non- existing user', async () => {
    await request(app).post('/users/login').send({
        email: "example2ewd@example.com",
        password: userOne.password
    }).expect(400);
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should get profile for unauthoricated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not delete account for unauthoricated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/fotoAvatar.png')
        .expect(200);
    const user = await User.findById(userOne);
    expect(user.avatar).toEqual(expect.any(Buffer))
});