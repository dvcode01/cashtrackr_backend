import { Column, DataType, HasMany, Table, ForeignKey, BelongsTo, Model, AllowNull } from 'sequelize-typescript';
import Expense from './Expense';
import User from './User';

@Table({
    tableName: 'budgets'
})

class Budget extends Model {
    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })

    declare name: string;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL
    })

    declare amount: number;

    @HasMany(() => Expense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare expenses: Expense[];

    @BelongsTo(() => User)
    declare user: User;
    
    @ForeignKey(() => User)
    declare user_id: number;
}

export default Budget;