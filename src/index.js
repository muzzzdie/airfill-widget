/* eslint-disable import/default */

import './index.scss';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import Widget from './components/Widget';
import {client} from './lib/api-client';

import configureStore from './store/configureStore';
let store;

function AirfillWidget(ele, opt) {
  const element = typeof ele === 'string' ? document.querySelector(ele) : ele;
  const options = {
    // Airfill Widget API key
    key: null,

    // Pass through order options
    refundAddress: '',          // Used for automatic refunds if there is an error (only for bitcoin integrations)
    userEmail: '',              // If set we won´t ask for the user email in step 3
    sendEmail: true,            // Send email receipt (default: true)
    sendSMS: true,              // Send SMS receipt, operator may send additional messages (default: true, only available for some operators)

    ...opt
  };

  // Alias BTC -> XBT as we use XBT internally
  if (options.billingCurrency === 'BTC') {
    options.billingCurrency = 'XBT';
  }

  client.configure({ token: options.key, baseUrl: options.baseUrl || 'https://api.bitrefill.com/widget' });

  const {
    billingCurrency,
    userEmail,
    userAccountBalance,
    requireAccountBalance,
    sendEmail,
    sendSMS,
    refundAddress,
    paymentButtons,
    showIntroduction,
    showBTCAddress
  } = options;
  const orderOptions = { email: userEmail, sendEmail, sendSMS, refundAddress };

  store = store || configureStore();

  render(
    <Provider store={store}>
      <Widget
        className="refill-widget-root standalone"
        billingCurrency={billingCurrency}
        orderOptions={orderOptions}
        paymentButtons={paymentButtons}
        showIntroduction={showIntroduction}
        showTerms={true}
        showBTCAddress={showBTCAddress}
        accountBalance={userAccountBalance}
        requireAccountBalance={requireAccountBalance}
      />
    </Provider>, element
  );
}

window.AirfillWidget = window.BitRefillWidget = AirfillWidget;
