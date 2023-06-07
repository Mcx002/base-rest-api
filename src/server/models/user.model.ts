import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface UserAttributes {
    id: number
    xid: string
    name: string
    email: string
}

export type UserCreationAttributes = Optional<UserAttributes, 'id'>

export class User extends Model {
    id!: number
    xid!: string
    name!: string
    email!: string

    static initModel(sequelize: Sequelize) {
        User.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                xid: {
                    type: DataTypes.STRING,
                    unique: true,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'User',
                timestamps: false,
            }
        )
    }
}
