import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  category: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  public async execute({
    category,
    title,
    value,
    type,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('That transaction type does not exist');
    }

    let categoriaDaTransaçãoEncontrada = await categoryRepository.findOne({
      where: { title: category },
    });

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError(
        'You cant withdraw that amount, not enough money',
        400,
      );
    }

    if (!categoriaDaTransaçãoEncontrada) {
      categoriaDaTransaçãoEncontrada = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(categoriaDaTransaçãoEncontrada);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoriaDaTransaçãoEncontrada,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
