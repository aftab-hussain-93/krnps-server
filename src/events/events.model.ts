import { Sequelize } from 'sequelize';
import {
    Column,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

@Table({
    timestamps: true,
    tableName: 'events',
    modelName: 'Event'
})
export class Event extends Model {
    @PrimaryKey
    @Column({ autoIncrement: true })
    id: number;

    @Column({ allowNull: false })
    title: string;

    @Column({})
    description: string;

    @Column({ allowNull: false })
    createdBy: number;

    @Column({ allowNull: false })
    fullAddress: string;

    @Column({ allowNull: false })
    city: string;

    @Column({ allowNull: false })
    state: string;

    @Column({ allowNull: false })
    country: string;

    @Column({})
    eventDate: Date;

    @Column({ allowNull: false })
    image: string;

    @Column({})
    deletedAt: Date;

    @Column({ defaultValue: Sequelize.fn('NOW') })
    createdAt: Date;

    @Column({ defaultValue: Sequelize.fn('NOW') })
    updatedAt: Date;
}