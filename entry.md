# Mein LLM-Jahr 2025

Wie haben sich LLMs - speziell für Softwareentwicklung - im Jahr 2025 entwickelt? 

## Der Stand Ende 2024

Ein spannendes AI-Jahr 2025 geht zu Ende. Wir erinnern uns an Ende 2024. Die besten LLMs waren ChatGPT o1 - ein erster, nicht sehr überzeugender Versuch eines "denkenden" Modells. Mit Claude Sonnet 3.5 war ein Modell verfügbar, das ganz gut im Entwickeln kleiner Apps war. Auch Googles Gemini 2.0 schlug sich da ganz wacker. Die Ergebnisse dieser Modelle im Benchmark "SWE Bench" lagen so bei 50% gelöster Programmieraufgaben.

In der Praxis konnte man diese Modelle mit etwas größeren Aufgaben betrauen als z.B. ChatGPT 4, aber bei komplexeren Umbauten des Codes scheiterten sie. Man musste die Modelle mit intensivem Händchenhalten betreuen - präzise Prompts, von kleiner Änderung zu kleiner Änderung tingeln.

Für normale Chattereien waren die Modelle ganz gut, immer noch geplagt von Halluzinationen hier und da, aber in vieler Hinsicht recht nützlich. Egal, ob es Hilfe bei Excel-Formeln, Buchzusammenfassungen, oder Erklärungen verschiedenster Dinge war, meist fand ich die Aussagen von ChatGPT ganz nützlich (und man bekam eine kompakte Antwort auf seine Frage, statt sich durch 20 Seiten Wikipedia wühlen zu müssen, von denen 19,5 Seiten irrelevantes Detailwissen waren).

## Der Anfang des Jahres 2025

Das erste Quartal wartete mit drei LLM-Donnerschlägen auf. Der größte in Punkto öffentliche Aufmerksamkeit war die Veröffentlichung des chinesischen Deepseek R1 Modells, das mit den US-Amerikanischen Top-LLMs konkurrieren konnte, zu einem Bruchteil der Trainingskosten, und mit einem Preismodell, das die amerikanischen LLMs dramatisch unterbot (heute kostet ein Input-Token eines OpenAI-Modells das Zehnfache von Deepseek R1. Mit Ausnahme von gpt-5-mini, das mit R1 nicht konkurrieren kann). Vom "AI Sputnik-Moment" war die Rede. Die amerikanische AI-Szene war in Aufruhr. Ich fand einerseits Deepseek R1 überbewertet. Überlastete Server, ewige Antwortzeiten, konfuses Reasoning. Andererseits ist es Open-Source mit veröffentlichten Papers dazu, ein schöner Kontrast zur Geheimhalterei von OpenAI, Google, Anthropic.

Meine Wow-Momente des Quartals waren Claude Sonnet 3.7 und Gemini 2.5 pro. Ersteres war so viel besser im Coding, dass der neue Begriff "Vibe Coding" tatsächlich aus dem Leben gegriffen war. Man muss gar nicht mehr in letztem Detail verstehen, was die AI schreibt. Drüberschauen als Sicherheits-Check, ansonsten kann man fast immer der AI vertrauen, dass sie für kleine und mittlere Projekte das Problem im Griff hat. Googles LLM hatte auch noch diesen lustigen Research Modus, wo man belanglose Aufgaben wie "was ist der beste Staubsaugroboter mit diesen Eigenschaften" stellen und einen dreissigseitigen Forschungsbericht erhalten konnte. Das war aber mehr ein Gimmick - wer hat denn Lust, sich einen dreissigseitigen Bericht durchzulesen?

## Jahresmitte

Die für mich dramatischste Änderung ergab sich ab Mai mit Claude 4 und GPT5 (und für mich Cursor): Der Schritt zum Spezifizieren und die AI machen lassen. Wo man vorher mit detaillierten Prompts Stück für Stück Software mit den LLMs geschrieben hat, und wo man vorher ab ca. 5.000 Zeilen an die AI-Grenzen gestoßen ist, wo die Maschinen sichtlich mit der Softwarekomplexität überfordert waren, konnte man mit Claude 4 und GPT5 ein ganzes Stück Software als Markdown-Dokument spezifizieren, und der Maschine sagen "Bau das wie spezifiziert". Und das hat die AI dann gemacht, und mehr als 1-2 Flüchtigkeitsfehler waren da meistens nicht drin. Und gleichzeitig stieg die Zeitdauer, die ein LLM zielgerichtet vor sich hin werkeln konnte, deutlich. 

Als Mensch, der in seinem Projekt "drin ist", muss man sich hier vergegenwärtigen, dass das bei der AI nicht so ist. Du öffnest einen neuen Chat, und die Maschine startet bei 0. Bekommt eine Aufgabe, ein bisschen Dokumente zu Aufbau des Projekts, Standards etc, und 10.000 Zeilen Code. Als Mensch würde man da sagen "okay, jetzt muss ich erst mal ein paar Tage das Projekt verstehen". Cursor + Claude 4 werkeln los, und man ist beeindruckt von den zielgerichteten, cleveren "Grep" Kommandos, mit denen es nach für die gewünschten Änderung relevanten Codestellen sucht, von den echt wirkenden Erkenntnissen und Plänen, die Änderung umzusetzen, von der Geschwindigkeit der Arbeit und der Qualität des Codes sowie automatischer Tests, die die Maschine erzeugt, durchführt, und ggf. etwas anpasst.

## Jahresausklang

Die neusten Modelle - Opus 4.5, GPT 5.2 - sind nochmal stärker. Waren ein Jahr zuvor 50% im SWE-Bench die Krone der LLM-Kunst, nähern sich die Modelle jetzt der 80%-Marke. Und dann war da "Humanity's last exam". Brutalst schwere Aufgaben aus allen Gebieten der Wissenschaft. Die Website des Exams hat 8 Beispielsaufgaben. Meine beeindruckende Score: 0/8. Bei den meisten habe ich nicht mal verstanden, was die Frage bedeutet. Ende 2024 führte das Ranking ChatGPT o1 mit 8% korrekten Antworten. Jetzt führt Gemini 3 pro mit 38,3%. GPT5.2 dahinter mit knapp unter 30%.

Das muss man sich mal vorstellen: die kompliziertesten Testfragen, die sich die internationale Wissenschaftler-Community ausdenken konnte. Ja, die Seite thematisiert korrekt, dass die Fachexperten des jeweiligen Faches hier noch signifikant besser sind. Doch zeigt mir den Menschen, der auch nur 10% der Fragen aus über 100 Fachgebieten korrekt beantworten kann. 

Ich fand es auch beeindruckend, dass irgendwann sowohl Cursor mit aktuellem Claude 4.5 als auch Github Copilot mit Cline und dem selben LLM von sich aus ein Browser-UI gestartet haben und ihr Coding via Browser-Fernbedienung erfolgreich getestet haben.

## AGI?

2025 scheint sich vermehrt die Frage gestellt zu haben, was denn der Begriff AGI, der in aller Munde ist, sein soll, und zu was er nützlich sein soll.

Wenn - wie oben gesehen - eine AI mehr Testfragen korrekt beantworten kann als jeder Mensch, aber eben kein akademischer Experte auf jedem der Gebiete ist, ist sie dann über oder unter menschlichem Niveau? Und sollte es nicht unser Ziel sein, LLMs zu bauen, die uns ergänzen statt solche, die mit uns konkurrieren? 

Eines ist klar: Software-Entwicklung ist das Endgame der AI-Konzerne - der schnellste Weg zur Superintelligenz wird erreicht, sobald nicht einige tausend Menschen, sondern Millionen genauso guter AI-Entwickler die nächste Generation noch besserer AI-Entwickler baut. Dann hätte man schnell in der Software-Entwicklung die berüchtigte Singularität erreicht, die AIs würden sich rasanter weiterentwickeln als das heute denkbar ist.

Ansonsten fehlt uns Menschen gerade die Phantasie, die Kreativitität, wie wir die Maschinen anders trainieren sollen, anders testen sollen als mit "kannst du das, was ich kann?". Hoffe auf 2026.

## AI Slop

Auch die AI Hater hatten wieder viel zu tun in 2025. Jetzt, wo anscheinend die letzten Experten den Begriff "Stochastic Parrot" aufgegeben haben, hat der Begriff "AI Slop" Konjunktur, ein abwertender Begriff von allem AI-generierten, der suggeriert, dass nur echte Menschen wahre Kunst, wahre Aussagen, schönes, anmutiges, lesenswertes schaffen können, und der Output einer AI per Definition wertlos sei.

Ich finde solch pauschale Aussagen schade. Es gibt viel zu diskutieren zum Thema AI - man denke an das Trump-Wirft-Fäkalien-aus-dem-Flugzeug Video. Wie erreicht man eine Unterscheidbarkeit von AI-generiertem Content und menschenerzeugtem Content? Wie kann man Deepfakes verhindern? Sind AI-generierte Beiträge in Social Media gut oder schlecht? Der Prozentsatz von "Human Slop" in den Social Media ist beileibe nicht niedrig, Desinformation durch durchtriebene Menschen ein großes Problem. Wo kann AI helfen, wo schadet sie? All das wird unter dem Slop-Argumentenbrei, vermischt mit dem "Alles gestohlen" Argumentensenf begraben.

## Die größten AI Gefahren

Spannend waren auch die Diskussionen um AI-Gefahren in 2025. Viel zu viel Fokus auf den Terminator-Szenarien Misalignter AIs. Viel zu wenig Fokus auf den meines Erachtens viel kritischeren Problemen:

1. Die - speziell bei Elon Musks Grok deutlich nachweisbaren - Bemühungen der führenden AI-Anbieter, die AIs mit ihrem Weltbild zu alignen. Kann man einer AI, die darauf trainiert wurde, zu bestimmten Themen bestimmte Meinungen zu haben, vertrauen? 

2. Das naive Vertrauen vieler Menschen in AIs in Kombination mit dem MCP-Protokoll, das die AIs aus ihren Chat-Sandboxen ausbrechen lässt. Geschichten wie ein Ikea-Support-Assistent, der eine Warensendung halluzinierte sollten viel mehr Beachtung erlangen als sie das haben. Man stelle sich geile neue Echtzeit-AI-Broker-Software vor, die von vielen naiven Menschen eingesetzt wird, und die irgendwann fälschlich einen Börsencrash halluziniert, und durch automatische Panikverkäufe auslöst. 

3. Der dramatische Rückstand der EU in dieser wichtigen Technologie. Etwa ein halbes Jahr hatte ich ein Mistral-Abo. Versuchte wirklich "EU first" zu gehen. Aber der Rückstand zur Spitze ist zu groß und scheint zu wachsen. Falls LLMs sich weiterentwickeln zu der disruptiven Technologie, wie es viele erwarten, gerät Europa in einen sehr schädlichen Rückstand. Meine einzige Hoffnung hier ist, dass die Sprachmodelle selbst zu Commodities werden, und es gar nicht so wichtig ist, wer diesen Software-Layer besitzt, sondern, was man damit macht.

## Mein Orakel für 2026

Wenn heute noch LLMs in der Software-Entwicklung am Besten geeignet für kleine Apps und Prototypen sind, wächst mit jedem Jahr die größe der Codebasis, die ein LLM gerade noch souverän bearbeiten kann. Ich tippe mal auf 100.000 Zeilen Code Ende 2026, und damit auf eine Größe vieler "echter" Projekte. Entwickeln durch Spezifizieren wird Ende 2026 Normalität sein.

Spannend wird, was mit Apps passiert. Werden die ganzen kleinen Apps - Todo-Listen, WLAN-Scanner, Taschenrechner, Texteditoren, Notizbücher, Tagebücher, Casual Spiele aussterben? Wird es große Sites (vermutlich im Besitz der LLM-Anbieter) geben, wo man, statt eine App zu kaufen, die halbwegs das tut, was man möchte, maßgeschneiderte Apps der AI in Auftrag gibt, und dann auf dem Handy eine größere Anzahl persönlicher Apps hat? Wird es Bibliotheken von App Spezifikationen geben, ähnlich wie heute Bibliotheken von Bildern, von 3D Modellen? Diese kann man nehmen, anpassen, under der AI zum Entwickeln geben?

Das ist mein Tipp für 2026. Ende 2026 werden Apps "von der Stange" auf dem Rückzug sein, persönliche Apps Einzug in die Leben der Menschen halten.

Ich bin gespannt.
 