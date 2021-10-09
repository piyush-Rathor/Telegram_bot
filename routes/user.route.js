import { Router } from 'express';

import * as userControllers from '../controllers/user.controller.js'
const routes = Router();

routes.post(
    '/login',
    userControllers.userLogin
);

routes.post(
    '/signup',
    userControllers.userSignUp
);

export default routes;