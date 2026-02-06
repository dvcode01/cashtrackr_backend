import { Table, Column, DataType, Model, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import Budget from './Budget';

@Table({
    tableName: 'expenses'
})

class Expense extends Model{
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

    @BelongsTo(() => Budget)
    declare budget: Budget;
    
    @ForeignKey(() => Budget)
    declare budget_id: number;
}

export default Expense;