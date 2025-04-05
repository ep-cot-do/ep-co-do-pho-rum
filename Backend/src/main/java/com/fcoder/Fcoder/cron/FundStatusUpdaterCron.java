package com.fcoder.Fcoder.cron;


import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.repository.AccountRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FundStatusUpdaterCron {

    private final AccountRepository accountRepository;

    public FundStatusUpdaterCron(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }
    @Scheduled(cron = "0 0 0 * * *")
    public void updateFundStatusForPaidAccounts() {
        List<AccountEntity> accounts = accountRepository.findAll();
        for (AccountEntity account : accounts) {
            if (account.getFundStatus()) {
                account.setFundStatus(true);
                accountRepository.save(account);
            }
        }
    }

    @Scheduled(cron = "0 0 0 1 1,5,9 *")
    public void resetFundStatusForNewQuarter() {
        List<AccountEntity> accounts = accountRepository.findAll();
        for (AccountEntity account : accounts) {
            account.setFundStatus(false);
            accountRepository.save(account);
        }
    }
}
