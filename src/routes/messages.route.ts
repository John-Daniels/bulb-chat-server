import { addMessage, getAllMessage } from '../controllers/messages/messages.controller'
import { Router } from 'express'
import { checkErrors } from '../utils/validators';
import { validateSendMessage } from '../utils/validators/messages.validator';
import { verifyAuthToken } from '../middlewares/auth.middleware';

const router = Router()

router.post('/send', verifyAuthToken, validateSendMessage, checkErrors, addMessage);

router.get('/:userId', verifyAuthToken, getAllMessage)

export default router
