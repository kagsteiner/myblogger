# Mein eigener Blog-Generator

Ich bin ja ein großer Freund eines eigenen Blogs. Jetzt nicht eigen im Sinne von "eine große Blogging-Maschinerie gibt mir irgendwelche Lizenzrechte an meinen Einträgen", auch nicht im Sinne von "kann da Blogs hinschreiben und habe nicht 20 Seiten Anwaltsenglisch gelesen, was der Anbieter damit machen kann". Auch nicht "ich werde reich durch bloggen, auch wenn meine User alle ihre Daten offenbaren, ohne es zu wissen". Nein. Ein eigenes Blog. Auf einem fairen Webhoster.

Der Anbieter meiner Wahl ist neocities. Ja, wie geocities damals. Gutes altes Internetgefühl.

Aber: Neocities hat nur einen ziemlich gräßlichen HTML-Editor. In diesem Blog beschreibe ich, wie man in 30 minuten zu einem Tool kommt, dass einem das Bloggen damit leicht macht. Also fast.

Achtung, das wird ein ziemlich konkreter und technischer Post. Du bist gewarnt.

## Voraussetzungen

Jupp, heftige Voraussetzungen. Ich habe Cursor + Claude Sonnet 4.5 verwendet. Vermutlich gehen auch andere LLM-Agentic-Entwicklungsumgebungen wie Claude Code oder Gemini CLI.

Das ist schon mal blöd und kostet Geld. 

## Noch ne Erklärung

Mein Blog ist deutsch/englisch. Ich schreibe in deutsch, und will, dass die AI automatisch die englische Version macht.

## Lost geht's. Der Prompt.

Gar keine einfache Sache - Beispiels-HTML lesen, Markdown-Text in HTML transferieren, der genauso funktionert, zweisprachige index.html updaten, und vor allem ChatGPT aufrufen, damit es den deutschen Text auf englisch übersetzt. Und etliche Kleinigkeiten.

## Und die AI werkelt los.

Einmal musste ich sie unterbrechen, weil sie sich in einem curl Kommando irgendwie aufgehängt hatte.

Danach war sie bereit. Ausprobiert. Tut nicht. Komischer Fehler. WIE? NICHT PERFEKT? Ich kopiere die gesamte Fehlermeldung in den Chat, das LLM erkennt, dass wohl eine veraltete OpenAI Version installiert wurde, ändert das. Danach will die Maschine es genau wissen, probiert die App aus, vergleicht, ob sie funktioniert, schaut, ob das Ergebnis in beiden Sprachen passt. Schaut, ob die index_de/en.html stimmen.

Als die AI sagt "Fertig", ist fertig.

Fast.

## Was geht und was nicht.

Okay, ich geb's zu, ich habe ChatGPT damals belogen, als ich mich registriere. Dort heisse ich "Karl Stein". Und prompt generiert ChatGPT mir in den übersetzten Text Karl Stein als meinen Namen. Seltsamerweise sogar im  Python-File, das ja eigentlich nicht ChatGPT sondern Claude Sonnet generiert hat. Hab ich da auch geschwindelt? 

Das habe ich, obschon praktisch keine Python-Kenntnisse, manuell geändert.

Und die Reihenfolge der Einträge im index.html stimmt nicht. Da hat sie eigentlich recht, die AI, neue Einträge gehören nach oben, nicht nach unten.

Aber sonst stimmt alles. 

## Ergebnis

15 Minuten Spec schreiben, 15 Minuten mit der AI arbeiten, bis das Skript steht, ein paar Nacharbeiten. Passt. Jetzt habe ich ein Python-Programm, das mir die Arbeit abnimmt. Alles, was ich jetzt tun muss, ist einen Blog-Eintrag als Markdown schreiben, und bekomme zwei HTML-Files in korrekter Formatierung + neue Index-Files. Fein.

Willst du sowas auch? Idealerweise für neocities? Schreib mir.


