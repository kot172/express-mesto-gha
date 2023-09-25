const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  badRequestStatus, notFoundStatus, serverErrorStatus, createdStatus, okStatus,
} = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError')
const NotFoundError = require('../errors/NotFoundError')

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.status(createdStatus).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    next(err);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then(() => {
      res.status(okStatus).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Карточка с _id: ${req.params.cardId} не найдена.`));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.status(okStatus).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Карточка с _id: ${req.params.cardId} не найдена.`));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.status(okStatus).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Карточка с _id: ${req.params.cardId} не найдена.`));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};
