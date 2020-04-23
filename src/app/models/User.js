import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    // chamando o método init da class Model
    super.init(
      {
        // colunas que serão inseridas pelo usuário (tirando o created_at, updated_at etc)
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        // Virtual é um campo que nunca vai existir na base de dados, apenas no código
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        // passar sequelize do parâmetro do init que vem da classe Model
        sequelize,
      }
    );

    // antes de qualquer usuário ser salvo, executa o Hook 'beforeSave'
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
