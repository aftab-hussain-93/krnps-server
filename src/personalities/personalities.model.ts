import { Sequelize } from 'sequelize';
import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { User } from '../users/users.model';

@Table({
    timestamps: true,
    tableName: 'personalities',
    modelName: 'Personality'
})
export class Personality extends Model {
    @PrimaryKey
    @Column({ autoIncrement: true })
    id: number;

    @Column({ allowNull: false })
    fullName: string;

    @Column({})
    designation: string;

    @Column({ allowNull: false })
    image: string;

    @ForeignKey(() => User)
    @Column({ allowNull: false })
    createdBy: number;

    @BelongsTo(() => User)
    creator: User;

    @Column({})
    deletedAt: Date;

    @Column({ defaultValue: Sequelize.fn('NOW') })
    createdAt: Date;

    @Column({ defaultValue: Sequelize.fn('NOW') })
    updatedAt: Date;
}