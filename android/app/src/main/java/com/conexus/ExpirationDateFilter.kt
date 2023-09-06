package com.conexus

import android.text.InputFilter
import android.text.Spanned

class ExpirationDateFilter : InputFilter {


    override fun filter(
        source: CharSequence?,
        start: Int,
        end: Int,
        dest: Spanned?,
        dstart: Int,
        dend: Int
    ): CharSequence {
        // Remove any non-digit characters from the source text
        // Remove any non-digit characters from the source text
        val newSource: String = source.toString().replace("[^\\d]", "")

        // Concatenate the current text in the EditText with the new source

        // Concatenate the current text in the EditText with the new source
        var newInput = dest.toString().substring(0, dstart) +
                newSource +
                dest.toString().substring(dend)

        // Check if the resulting input has a valid length (MM/YY format)

        // Check if the resulting input has a valid length (MM/YY format)
        if (newInput.length > 5) {
            return ""
        }

        // Add a '/' character between the month and year if needed

        // Add a '/' character between the month and year if needed
        if (newInput.length == 2) {
            newInput += "/"
        }

        // Prevent entering invalid month values

        // Prevent entering invalid month values
        if (newInput.length == 3 && newInput.substring(0, 2).toInt() > 12) {
            return ""
        }

        // Prevent entering invalid year values

        // Prevent entering invalid year values
        return if (newInput.length == 5 && newInput.substring(3, 5).toInt() < 20) {
            ""
        } else newInput

    }
}