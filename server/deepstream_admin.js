import { getCollection } from './mongo_interface';
import { publishSubscription } from './deepstream_publishers';

export function configureAdminListeners(deepstream) {

  // Params
  // admin_id: user id
  // admin_name: user name
  // user_id: user to modify
  // balance: amount to add
  deepstream.event.subscribe('admin_add_balance', command => {

    console.log(`Admin ${command.admin_name} is adding ${command.balance} to ${command.user_id}'s balance`);

    if (!command.admin_id || !command.admin_name || !command.user_id || !command.balance) {
      console.log("Missing parameter");
      return;
    }

    getCollection('subscription').findOneAndUpdate({'user_id': command.user_id}, {
        '$inc': {
            'balance': command.balance
        },
        '$push': {
            'history': {
                'time': new Date(),
                'type': 0,
                'amount': command.balance,
                'description': `Deposit by ${command.admin_name}`,
                'processed': true
            }
        }
    }, (err, res) => {

      publishSubscription(command.user_id);
    });
  });

  deepstream.event.subscribe('admin_remove_balance', command => {

    console.log(`Admin ${command.admin_name} is removing ${command.balance} from ${command.user_id}'s balance`);

    if (!command.admin_id || !command.admin_name || !command.user_id || !command.balance) {
      console.log("Missing parameter");
      return;
    }

    getCollection('subscription').findOneAndUpdate({'user_id': command.user_id}, {
        '$inc': {
            'balance': -command.balance
        },
        '$push': {
            'history': {
                'time': new Date(),
                'type': 1,
                'amount': command.balance,
                'description': `Manual adjustment by ${command.admin_name}`,
                'processed': true
            }
        }
    }, (err, res) => {

      publishSubscription(command.user_id);
    });
  });
}