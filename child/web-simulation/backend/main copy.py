# -*- coding: utf-8 -*-
"""
Created on Sun Nov  3 22:02:24 2024

@author: mabrouk & younes
"""
import re
from datetime import datetime
from functions import (
    record_audio,
    transcript,
    generate_speech,
    prompt_child_to_write,
    fix_ayat,
)

ayat_al_fatiha = [
    {"ayah_number": 1, "text": "الحمد لله رب العالمين"},
    {"ayah_number": 2, "text": "الرحمن الرحيم"},
    {"ayah_number": 3, "text": "مالك يوم الدين"},
    {"ayah_number": 4, "text": "إياك نعبد وإياك نستعين"},
    {"ayah_number": 5, "text": "اهدنا الصراط المستقيم"},
    {"ayah_number": 6, "text": "صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين"},
]


def main():
    surah = "الفاتحة"
    previous_ayat = []

    for i, aya in enumerate(ayat_al_fatiha):
        repeat = True

        while repeat:
            print(f"\nالآية {aya['ayah_number']}: {aya['text']}")
            ayat_fix = transcript(aya["text"])
            print("========-----=========", ayat_fix)

            resp = fix_ayat(surah, aya["ayah_number"], aya["text"], ayat_fix)

            match = re.search(r"(\d+(\.\d+)?)%", resp)
            if match:
                accuracy_percentage = float(match.group(1))
                print(f"نسبة حفظ الطفل للاية هي: {accuracy_percentage}%")
            else:
                print("لم يتم العثور على نسبة مئوية في النص.")
                continue

            if accuracy_percentage == 100:
                if len(previous_ayat) == 1:
                    repeat_ = True
                    while repeat:
                        print("تجاوزت نسبة الدقة 100%. لقد حفظت آيتين الرجاء إعادتهم:")
                        for p_aya in previous_ayat:
                            print(f"{p_aya['ayah_number']} {p_aya['text']}")
                        print(f"{aya['ayah_number']} {aya['text']}")

                        ayat_text = " ".join([p_aya["text"], aya["text"]])
                        ayat_number = " ".join(
                            [str(p_aya["ayah_number"]), str(aya["ayah_number"])]
                        )

                        print("اكتب الآيتين أعلاه   .../n")
                        ayat_fix = transcript(ayat_text)
                        print("ayat_fix", ayat_fix)
                        
                        return

                        resp = fix_ayat(surah, ayat_number, ayat_text, ayat_fix)

                        match = re.search(r"(\d+(\.\d+)?)%", resp)
                        if match:
                            accuracy_percentage_ = float(match.group(1))
                            print(f"نسبة حفظ الطفل للاية هي: {accuracy_percentage}%")
                        else:
                            print("لم يتم العثور على نسبة مئوية في النص.")
                            continue
                        if accuracy_percentage_ >= 70:
                            previous_ayat = []
                            previous_ayat.append(aya)
                            repeat = False
                        repeat_ = False
                else:
                    print("تجاوزت نسبة الدقة 100%. يمكن الانتقال إلى الآية التالية.")
                    previous_ayat.append(aya)
                    repeat = False
            else:
                print("لم يتم تحقيق نسبة الدقة المطلوبة. الرجاء إعادة الآية.")

    print("\nمبروك! لقد أنهيت حفظ سورة الفاتحة.")


if __name__ == "__main__":
    main()
