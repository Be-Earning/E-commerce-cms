enum PersonalEnum {
  IDNumber = 'ID Number',
  agentName = "Agent's Name",
  email = 'Email',
  phoneNumber = 'Phone Number',
  registrationDate = 'Registration Date',
  address = 'Address',
  referredGuests = 'Referred Guests',
  revenue = 'Revenue',
  metanodeWallet = 'Metanode Wallet',
  visa = 'Visa',
  IDCustomer = 'ID Customer',
  fullName = 'Full Name',
  dateOfBirth = 'Date of Birth',
  gender = 'gender',
  signInDate = 'Sign In Date'
}

const personalStatus = {
  Inactive: 0,
  Active: 1,
  Locked: 2
}

const personalWithWalletInfor = {
  IDNumber: '5647686899',
  email: 'leolubin@gmail.com',
  agentName: 'SuperW',
  phoneNumber: '+84 899 398 399',
  registrationDate: '20/10/2000',
  referredGuests: 150,
  address: '1234 Elm Street, Springfield, IL 62704, USA',
  revenue: '$1000',
  metanodeWallet: [
    {
      name: 'Carter Calzoni',
      wallet: 'g67d2b3c4d5e6f7g8hd45a'
    },
    {
      name: 'Michacle Malik',
      wallet: 'f68d2b3c4d5e6f7g8df5a'
    }
  ],
  visa: {
    cardNumber: '1234 5678 9101 9889',
    cardHolder: 'Leo Lubin',
    expirationDate: '10/24'
  },
  status: 1,
  avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGMvEQPKYQhv8HGhKYOzgvYTRcnWeHw_H0gg&s'
}

const personalWithPaymentInfor = {
  IDCustomer: '5647686899',
  email: 'leolubin@gmail.com',
  fullName: 'Leo Lubin',
  phoneNumber: '+84 899 398 399',
  dateOfBirth: '20/10/2000',
  address: [
    '1234 Elm Street, Springfield, IL 62704, USA',
    '789 Maple Avenue, Anytown, CA 90210, USA',
    '456 Oak Drive, Metropolis, NY 10001, USA'
  ],
  gender: 0,
  signInDate: '20/03/2024',
  metanodeWallet: [
    {
      name: 'Carter Calzoni',
      wallet: 'g67d2b3c4d5e6f7g8hd45a'
    },
    {
      name: 'Michacle Malik',
      wallet: 'f68d2b3c4d5e6f7g8df5a'
    }
  ],
  visa: '1234 5678 9101 9889',
  status: 1,
  avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGMvEQPKYQhv8HGhKYOzgvYTRcnWeHw_H0gg&s'
}

export { PersonalEnum, personalStatus, personalWithPaymentInfor, personalWithWalletInfor }
