import React, { useContext } from 'react'
import { RfqContext } from './RfqContext'
import { convertToBaseUnits, formatUnits, fromCents, getExchangeRate } from '../currency-utils'

type PayinAmountInputProps = {
  minPayinAmount: number;
  maxPayinAmount: number;
  isAmountValid: boolean;
  validateAmount: (value: string) => void;
  currentPayinAmount: string;
  setCurrentPayinAmount: (value: string) => void;
  currentPayoutAmount: string;
  setCurrentPayoutAmount: (value: string) => void;
}

/**
 * This component represents an input form for selecting and displaying quote amounts.
 *
 * @param {number} props.minQuoteAmount - The minimum allowed quote amount.
 * @param {number} props.maxQuoteAmount - The maximum allowed quote amount.
 * @param {boolean} props.isAmountValid - Indicates whether the entered amount is valid.
 * @param {Function} props.validateAmount - A function to validate the entered amount.
 * @param {string} props.currentBaseAmount - The current base amount.
 * @param {Function} props.setCurrentBaseAmount - A function to set the current base amount.
 * @param {string} props.currentQuoteAmount - The current quote amount.
 * @param {Function} props.setCurrentQuoteAmount - A function to set the current quote amount.
 * @param {Object} props.selectedOffering - The selected offering object.
 * @param {Function} props.setSelectedOffering - A function to set the selected offering.
 * @returns {JSX.Element} - Returns the QuoteAmountInput component.
 */
export function PayinAmountInput(props: PayinAmountInputProps) {
  const { offering } = useContext(RfqContext)
  // const [selectedCurrency, setSelectedCurrency] = useState(props.selectedOffering.quoteCurrency.currencyCode)

  const payinCurrency = offering.payinCurrency.currencyCode
  const payoutCurrency = offering.payoutCurrency.currencyCode

  const handlePayinAmountChange = (payinAmount: string) => {
    const formattedPayinAmount = formatUnits(payinAmount, 8)
  
    props.setCurrentPayinAmount(formattedPayinAmount)
    props.setCurrentPayoutAmount(
      convertToBaseUnits(formattedPayinAmount, offering.payoutUnitsPerPayinUnit)
    )
    props.validateAmount(formattedPayinAmount)
  }

  return (
    <div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <p className={`absolute mt-[-10px] ml-3 text-sm text-red-600 ${props.isAmountValid ? 'hidden' : ''}`}>
          {props.minPayinAmount >= 0 && parseFloat(props.currentPayinAmount) < props.minPayinAmount
            ? `Minimum order is ${props.minPayinAmount} ${payinCurrency}`
            : props.maxPayinAmount >= 0 && parseFloat(props.currentPayinAmount) > props.maxPayinAmount
            ? `Maximum order is ${props.maxPayinAmount} ${payinCurrency}`
            : null}
        </p>
        <div className="flex items-center">
          <input
            type="text"
            className="block w-full text-2xl border-0 text-indigo-600 bg-transparent rounded-md focus:text-indigo-600 placeholder:text-gray-400 focus:ring-transparent sm:leading-6"
            placeholder="0.00"
            aria-describedby="price-currency"
            value={props.currentPayinAmount}
            onChange={(e) => handlePayinAmountChange(e.target.value)}
          />
          <div className='mr-10 pr-1 mb-1 text-gray-400 text-xl'>{payinCurrency}</div>
        </div>        
        <label className="block text-xs leading-6 pl-3 -mt-3 text-gray-300">{'You Send'}</label>
      </div>

      <div className="relative mt-3 rounded-md shadow-sm">
        <div className="flex items-center">
          <input
            type="text"
            className="block w-full text-2xl border-0 py-1.5 text-neutral-200 bg-transparent rounded-md placeholder:text-gray-400 focus:ring-transparent sm:leading-6"
            placeholder="0.00"
            aria-describedby="price-currency"
            value={formatUnits(props.currentPayoutAmount, 8)}
            readOnly
          />
          <div className='mr-10 pr-1 mb-1 text-gray-400 text-xl'>{payoutCurrency}</div>
        </div>   
      </div>
      <label className="block text-xs leading-6 pl-3 -mt-1 text-gray-300"> {'They get'} </label>{' '}

      <div className="grid grid-cols-2 gap-0.5 mt-5 border border-gray-500 rounded-md p-3 text-xs">
        <div className="text-left text-gray-400">Est. rate</div>
        <div className="text-right w-[130%] ml-[-30%] text-gray-400">{getExchangeRate(offering.payoutUnitsPerPayinUnit, payinCurrency, payoutCurrency)}</div>

        <div className="text-left text-gray-400 mt-2">Service fee</div>
        {offering.feeSubunits ? (
          <div className="text-right text-gray-400 mt-2">{fromCents(offering.feeSubunits).format()}</div>
        ) : (
          <div className="text-right text-gray-400 mt-2">0.00 {payinCurrency}</div>
        )}     
      </div>
    </div>
  )
}
