import {DataTypes} from 'sequelize' ; 
import {sequelize} from '../config/database.js'

// defining the Signal model - this becomes the 'signals' table in DB 

const Signal = sequelize.define('Signal', {
    id: {
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    }, 
    symbol: {
        type: DataTypes.STRING, 
        allowNull: false 
    }, 
    direction: {
        type: DataTypes.ENUM('BUY', 'SELL'), 
        allowNull: false
    }, 
    entry_price: {
        type: DataTypes.FLOAT, 
        allowNull: false, 
    }, 
    stop_loss: {
        type: DataTypes.FLOAT, 
        allowNull: false, 
    }, 
    target_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }, 
    entry_time: {
        type: DataTypes.DATE, 
        allowNull: false, 
    },
    expiry_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('OPEN', 'TARGET_HIT', 'STOPLOSS_HIT', 'EXPIRED'),
    defaultValue: 'OPEN', 
    allowNull: false,
  },
  realized_roi: {
    type: DataTypes.FLOAT,
    allowNull: true, 
  },
}, {
    timestamps: true, 
    tableName: 'signals'
}) ; 

export default Signal ; 