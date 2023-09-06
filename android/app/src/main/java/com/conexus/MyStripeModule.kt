package com.conexus

import android.text.InputFilter
import android.view.LayoutInflater
import android.view.View
import android.widget.Button
import android.widget.EditText
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.ThemedReactContext
import com.stripe.android.ApiResultCallback
import com.stripe.android.Stripe
import com.stripe.android.model.PaymentMethod
import com.stripe.android.model.PaymentMethodCreateParams
import com.stripe.android.view.CardInputWidget
import java.util.Objects


class MyStripeModule(val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    lateinit var stripe: Stripe
    override fun getName(): String {
        return "MyStripeModule"
    }

    @ReactMethod
    fun intializeStripe(publishKey: String) {
        stripe = Stripe(
            context.applicationContext,
            Objects.requireNonNull(publishKey)
        )
    }

    @ReactMethod
    fun inflateMyXmlLayout(callback: Callback) {

        val context: ThemedReactContext = reactApplicationContext as ThemedReactContext
        val inflater = LayoutInflater.from(context)
        //val view: View = inflater.inflate(R.layout.stripe_module, null)
        //context.currentActivity!!.setContentView(view)
//        val cardNumber =  view.findViewById<EditText>(R.id.cardNumberEditText)
//
//
//        val filters = arrayOf<InputFilter>(CardNumberFilter())
//        cardNumber.filters = filters
//
//        val expirationDateFilter = arrayOf<InputFilter>(ExpirationDateFilter())
//
//        val expDate =  view.findViewById<EditText>(R.id.expDateEditText)
//        expDate.filters = expirationDateFilter
//
//        val cvc =  view.findViewById<EditText>(R.id.cvcEditText)
//
//        val payButton  = view.findViewById<Button>(R.id.payButton)
//
//        payButton.setOnClickListener {
//            val exp = expDate.text.split('/')
//            getPaymentId(cardNumber.text.toString(),cvc.text.toString(),exp[1].toInt(),exp[0].toInt(), callback)
//        }
    }

    @ReactMethod
    fun getPaymentId(
        cardNo: String,
        cvc: String,
        expYear: Int,
        expMonth: Int,
        callback: Callback
    ) {

        val cardInputWidget = CardInputWidget(context.applicationContext)
        cardInputWidget.setCardNumber(cardNo)
        cardInputWidget.setCvcCode(cvc)
        cardInputWidget.setExpiryDate(expMonth, expYear)



        cardInputWidget.paymentMethodCreateParams?.let { pmCreateParams: PaymentMethodCreateParams ->
            stripe.createPaymentMethod(
                paymentMethodCreateParams = pmCreateParams,
                callback = object :
                    ApiResultCallback<PaymentMethod> {
                    override fun onError(e: Exception) {
                        callback.invoke(e.message, null)
                        // return null
                        // Log.d("hello","${e.message}")
                        // Toast.makeText(requireContext(),"${e.message}",Toast.LENGTH_LONG).show()
                    }

                    override fun onSuccess(result: PaymentMethod) {
                        //Log.d("hello","${result.id}")
                        //  return result.id
                        callback.invoke(null, result.id)
                    }
                })
        }


    }


}