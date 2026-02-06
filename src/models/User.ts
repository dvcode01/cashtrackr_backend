import { Table, Model, Column, DataType, Unique, Default, AllowNull } from 'sequelize-typescript'; 

@Table({
    tableName: 'users'
})

class User extends Model{
    @AllowNull(false)
    @Column({
        type: DataType.STRING(60)
    })
    declare name: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(50)
    })
    declare password: string;

    @Unique(true)
    @AllowNull(false)
    @Column({
        type: DataType.STRING(20) 
    })
    declare email: string;

    @Column({
        type: DataType.STRING(10)
    })
    declare token: string;

    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    declare confirmed: boolean;
}

export default User