export function formatPrice(price) {
  if (!price || price.trim() === "" || isNaN(Number(price))) {
    return "—";
  }
  return "₹ " + Number(price).toLocaleString("en-IN");
}

export function generatePriceMessage(lang, arabicaPrice, robustaPrice, arecanutPrice, date) {
  if (lang === "kn") {
    return `☕ ಫಲ್ಗುಣಿ ಕಾಫಿ ಟ್ರೇಡ್ಸ್

ದಿನಾಂಕ: ${date}
ಅರೇಬಿಕಾ ಕಚ್ಚಾ ಕಾಫಿ: ${arabicaPrice}
ರೋಬಸ್ಟಾ ಕಚ್ಚಾ ಕಾಫಿ: ${robustaPrice}
ಅಡಿಕೆ ಕಚ್ಚಾ: ${arecanutPrice}

⚠️ ಗಮನಿಸಿ: ಈ ದರಗಳು 90% ಅಥವಾ ಹೆಚ್ಚು ಹಣ್ಣುಗಳಿರುವ ಕಾಫಿಗೆ ಅನ್ವಯಿಸುತ್ತವೆ.
90% ಕ್ಕಿಂತ ಕಡಿಮೆ ಹಣ್ಣುಗಳಿದ್ದರೆ ದರಗಳು ಬದಲಾಗಬಹುದು.

ಸಂಪರ್ಕ ವಿವರಗಳು:
ಸಮಂತ್ ಬಿ ಪಿ: +91 8277446831
ಶಶ್ವತ್ ಎಂ ಆರ್: +91 9902440431

ಸ್ಥಳ: ಮೂಡಿಗೆರೆ | ಚಿಕ್ಕಮಗಳೂರು | ಬೇಲೂರು | ಸಾಕ್ಲೇಶಪುರ ಸುತ್ತಮುತ್ತಲಿನ ಪ್ರದೇಶಗಳು·`;
  } else {
    return `Phalguni Coffee Trades

Date: ${date}
Arabica Raw Coffee: ${arabicaPrice}
Robusta Raw Coffee: ${robustaPrice}
Arecanut Raw: ${arecanutPrice}

⚠️ Note: These rates are applicable for coffee with 90% or more fruits.
Rates may vary for coffee with less than 90% fruits.

Contact Details:
Samanth B P: +91 8277446831
Shashwath M R: +91 9902440431

Location: In and around 
Mudigere | Chickmagaluru | Belur | Sakaleshpura·`;
  }
}
