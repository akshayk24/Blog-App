module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'Categories',
            [
                {
                    name: 'Programming',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: 'Science',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: 'Entertainment',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: 'Automobile',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: 'Travel',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: 'Food',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: 'General',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Categories', null, {});
    },
};
