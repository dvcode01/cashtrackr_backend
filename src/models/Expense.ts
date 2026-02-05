import { Table, Column, DataType, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Budget from './Budget';

@Table({
    tableName: 'expenses'
})

class Expense extends Model{
    @Column({
        type: DataType.STRING(100)
    })

    declare name: string;

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