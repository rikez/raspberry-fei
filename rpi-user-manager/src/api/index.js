'use strict';

const { Router } = require('express');
const router = new Router();

/**
 * Register the routes to the respective handlers
 * @param {{ userController: UserController}}
 * @returns {Express.Router}
 */
function getRoutes({ userController }) {
  return () => {
    router
      .get('/:id', userController.getById.bind(userController))
      .delete('/:id', userController.delete.bind(userController))
      .put('/:id', userController.update.bind(userController));

    router
      .get('/', userController.getAll.bind(userController))
      .post('/', userController.create.bind(userController));


    return router;
  };
}

module.exports = getRoutes;

