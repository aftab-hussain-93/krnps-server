import { Sequelize } from 'sequelize';
import {
	Column,
	DataType,
	Default,
	Model,
	PrimaryKey,
	Table,
	Unique,
} from 'sequelize-typescript';

type userTypeStatus = 'email' | 'google' | 'facebook' | 'phone';

@Table({
	timestamps: true,
	tableName: 'users',
	modelName: 'User'
})
export class User extends Model {
	@PrimaryKey
	@Column({ autoIncrement: true })
	id: number;

	@Unique(true)
	@Column({ allowNull: false })
	email: string;

	@Column({ allowNull: false })
	password: string;

	@Column({ allowNull: false })
	firstName: string;

	@Column({ allowNull: false })
	lastName: string;

	@Column({ allowNull: false })
	createdBy: number;

	@Default('email')
	@Column(DataType.ENUM('email', 'google', 'facebook', 'phone'))
	userType: userTypeStatus;

	@Default(false)
	@Column({ allowNull: false })
	isAdmin: boolean;

	@Column({ defaultValue: true })
	isActive: boolean;

	@Column({ defaultValue: Sequelize.fn('NOW') })
	createdAt: Date;

	@Column({ defaultValue: Sequelize.fn('NOW') })
	updatedAt: Date;
}