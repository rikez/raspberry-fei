'use strict';
const { User } = require('./model');

/**
 * HTTP Handler for the raspberry users.
 * @class UserController
 */
class UserController {
  /**
   * Creates an instance of UserController.
   * 
   * @param {*} kafkaProducer
   * @memberof UserController
   */
  constructor(kafkaProducer) {
    this._producer = kafkaProducer;
  }
  /**
   * Creates a new user
   * @method POST
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @memberof UserController
   */
  async create(req, res, next) {
    try {
      const user = new User(req.body);
      const result = await user.save();

      this._producer.publish('user-subscription', { 
        operation: 'create', 
        userId: result.email, 
        thresholdHumidity: result.device.thresholdHumidity, 
        thresholdTemperature: result.device.thresholdTemperature, 
        phone: result.phone, 
        deviceId: result.device.deviceId 
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch an user
   * @method GET
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @memberof UserController
   */
  async getById(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch all users
   * @method GET
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @memberof UserController
   */
  async getAll(req, res, next) {
    try {
      const users = await User.find({});

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch all users
   * @method GET
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   * @memberof UserController
   */
  async update(req, res, next) {
    try {
      const updated = await User.findByIdAndUpdate(req.params.id, req.body);

      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user.
   *
   * @param {*} req
   * @param {*} res
   * @memberof UserController
   */
  async delete(req, res, next) {
    try {
      const deleted = await User.findByIdAndRemove(req.params.id);
      this._producer.publish('user-subscription', { operation: 'delete', userId: deleted.email });

      res.status(200).json(deleted);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;