import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const findTransaction = await transactionRepository.findOne({
      where: { id },
    });

    if (!findTransaction) {
      throw new Error('transaction does not exist');
    }

    await transactionRepository.remove(findTransaction);
  }
}

export default DeleteTransactionService;
