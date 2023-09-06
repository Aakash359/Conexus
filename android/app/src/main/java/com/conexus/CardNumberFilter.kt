package com.conexus

import android.text.InputFilter
import android.text.Spanned

class CardNumberFilter : InputFilter {
    override fun filter(
        source: CharSequence?,
        start: Int,
        end: Int,
        dest: Spanned?,
        dstart: Int,
        dend: Int
    ): CharSequence {
        // Remove any spaces from the source text
        // Remove any spaces from the source text
        val newSource: String = source.toString().replace("\\s", "")

        val sb = StringBuilder()
        sb.append(dest!!.subSequence(0, dstart))
            .append(newSource)
            .append(dest.subSequence(dend, dest.length))

            // Insert a space after every 4 characters

            // Insert a space after every 4 characters

                var i = 4
                while (i < sb.length) {
                    if (sb[i] != ' ') {
                        sb.insert(i, ' ')
                    }
                    i += 5
                }


        return sb.toString()
    }


}