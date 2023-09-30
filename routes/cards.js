const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  addCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const urlRegex = require('../utils/constans');

router.get('/', getCards);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex),
  }),
}), addCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = router;
