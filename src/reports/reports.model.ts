import { Sequelize } from 'sequelize';
import {
    BelongsTo,
    Column,
    ForeignKey,
    Default,
    Model,
    PrimaryKey,
    DataType,
    Table,
} from 'sequelize-typescript';
import { User } from '../users/users.model';

export type reportTypes = 'audit' | 'plan' | 'budget' ;

@Table({
    timestamps: true,
    tableName: 'reports',
    modelName: 'Report'
})
export class Report extends Model {
    @PrimaryKey
    @Column({ autoIncrement: true })
    id: number;

    @Default('plan')
    @Column(DataType.ENUM('audit', 'plan', 'budget'))
    fileType: reportTypes;

    @Column({ allowNull: false })
    filePath: string;

    @Column({ allowNull: false })
    folder: string;

    @Column({ allowNull: false })
    originalName: string;

    @Column({ allowNull: false })
    fileName: string;

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