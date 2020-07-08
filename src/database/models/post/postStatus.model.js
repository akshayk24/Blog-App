import db from 'db';
import * as Sequelize from 'sequelize';

const PostStatus = db.define('PostStatus', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});
export default PostStatus;
