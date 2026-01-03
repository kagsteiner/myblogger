# Warum ich auf neocities blogge - und über das neue Kommentarsystem

In eigener Sache: ich finde die großen Blog-Plattformen wie wordpress schrecklich und betrachte sie als einen Teil des schlimmen Dings, zu dem sich das Internet entwickelt hat. Darum blogge ich mit Hilfe selbstgeschriebener Tools (okay, selbst spezifiziert und von LLMs geschrieben) auf neocities. 

## Warum ist zB Wordpress so schlimm? 

Inzwischen sind die bösen Algorithmen (zurecht als böse bezeichnet), mit denen die großen sozialen Netzwerke den Content auswählen, der uns gezeigt wird, und die nicht meine Freude sondern "Engagement" optimieren, in aller Munde. Was nicht in aller Munde ist: auch in der Blogging-Welt wird nichts mehr dem Zufall überlassen. Ich habe mal zum Spaß meinen letzten Blogeintrag (mein LLM-Jahr 2025) in Wordpress kopiert.

Dort stehen mir alle möglichen Tools zur Verfügung, um aus meinem drögen Text etwas zu machen, das besser ankommt beim Publikum. Mehr häufige Wörter im Titel! Mehr emotionale Wörter im Titel! Das ist nicht direkt algorithmisch wie in den sozialen Netzen, aber die Idee ist das gleiche. Weg von meinem authentischen Text, hin zu Besucher-Aufmerksamkeits-Maximierung. 

img=020_titleanalyzer.jpg alt=Der Titel-Analyzer

Und dann sind da die Statistiken. Die Wordpress-Umgebung, die ich nutzen könnte, zeigt selbst mir Umsonst-Nutzer eine Unzahl von Statistiken über die Menschen an, die mein Blog lesen. Das ist einerseits praktisch. Andererseits finde ich es einen unnötigen Einbruch in anderer Menschen Privatsphäre.

img=020_stats.jpg alt=Die Statistiken

## Was ist an neocities anders?

Neocities hostet HTML-Seiten, sonst nichts. Und Neocities führt eine einzige Statistik: die Seitenaufrufe und Besuche meiner ganzen Website. So muss das sein.

## Was macht mein Blogging-Tool?

Ich finde es praktisch, auf deutsch zu schreiben, und von einem LLM, das besser englisch kann als ich, einen Übersetzungsvorschlag zu bekommen. Und ich finde es praktisch, wenn du wählen kannst, ob du meine Blog-Einträge auf deutsch oder englisch liest (und ich nicht google translate im Browser vertrauen muss). Und dann finde ich es noch praktisch, wenn ein LLM meine Blog-Posts mit HTML-Verweisen auf gängige Begriffe anreichert, die ich nicht selbst machen muss. Ach ja, und ich hätte gern altmodisch schönes HTML, nicht den Dreck (sorry), den die ganzen Generatoren wie Wordpress erzeugen.

Das macht mein Tool. Könnt ihr euch ansehen auf <a href="https://github.com/kagsteiner/myblogger">meinem Github</a>.

## Und jetzt das Kommentarsystem!

Okay, aber als Ergebnis hatte ich das wohl weltweit einzige Blog, das es nicht möglich machte, einen Kommentar zu hinterlassen.

Jetzt schon! Ich bin noch nicht sicher, ob ich rückwirkend alle Seiten mit dem Kommentarfeld ausstatte, aber die neusten haben jetzt eine Kommentierfunktion. Die vielleicht sogar funktioniert.

Weiterhin gilt: ausser das, was du angibst (irgendeinen Namen, irgendeinen Kommentar) und das Datum deines Kommentars speichere ich nichts. Ich behalte mir allerdings vor, alle Kommentare zu moderieren. Gibt ja genug Spammer und Trolle und Hater. Ich versuche mich dabei an die gängigen Bedingungen zu halten.

Auch das Kommentarsystem könnt ihr auf github anschauen.

### Zur Entstehung des Kommentarsystems

Falls es dich interessiert. Auch das Kommentarsystem habe ich für Cursor + Claude Opus 4.5 spezifiziert, und das hat es dann gebaut. Erkenntnisse:

* 100% des Codes war korrekt. Kein einziger Fehler, nicht im Kommentarsystem. Nicht im Moderations-UI. Nicht im Backend. Nicht im Frontend. Auf Anhieb.
* Ich hatte dennoch sehr viel Ärger mit zwei Dingen: neocities verwendet HTTPS:, hier HTTP-Verbindungen zu meinem kleinen VPS machen geht nicht. Auch Workarounds, die das LLM vorschlug, gingen nicht (wie das LLM schon vermutetete). Also musste ich HTTPS unterstützen. Das war schon eklig mit Tools, die ich nicht kenne und nicht kennen will, aber als admin doch nicht aufrufen will, ohne grob zu verstehen, was das tut (nginx, certbot). Und als HTTPS ging, musste ich CORS so konfigurieren, dass es sowohl die Javascript-Files für das UI als auch die Endpoints auf meinem VPS in EINER ANDEREN DOMÄNE laden wollte. Unschöne Stunde meines Lebens.

Aber am Ende war es das wert. 3000 Zeilen AI-generierter Code, bisschen Ärger. Vielleicht 2 Stunden Arbeit. Zutaten gut vermischen, fertig ist das Kommentarsystem. Bin gespannt, ob du es benutzt.

