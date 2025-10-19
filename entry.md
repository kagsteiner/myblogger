# Zusammenfassung meines Experiments mit AI in RPGMaker

## Das Plugin

Die Grundidee des Experiments war, ein Plugin zu schreiben, das es dem Spieleentwickler (mir) erlaubt, beliebige LLMs als NPCs zu verwenden - im RPGMaker MZ im Rahmen eines Events. Dazu brauchte ich neben Plugin-Kommandos, um dem LLM zu sagen, was es machen soll, sowohl Aktionen, die das LLM im RPGMaker ausführen kann - das Event bewegen, etwas sagen, einen Gegenstand weggeben, einen Schalter betätigen, als auch die Möglichkeit für den Spieler, einfach auf Aktionen des NPC zu reagieren: Aktiv einen Chat einleiten, auf eine Chat-Nachricht antworten, einen Gegenstand geben.

Und dem LLM musste genug über die Situation beigebracht werden, damit es vernünftige Entscheidungen treffen kann: wer ist der NPC? Wo befindet er sich? Wo sind Spieler und andere Events? Was ist bisher passiert? Welche Gegenstände besitzt er? Und was will er?

Mit Hilfe der Entwicklungsumgebung Cursor und einem LLM - ich bin kürzlich von Claude 4.5 auf GPT 5 umgestiegen - war das Entwickeln eines Plugins mit diesen Features problemlos. Ich war erstaunt von dem umfassenden Wissen der Maschine bzgl der Entwicklung von RPGMaker Plugins, was jetzt ja nicht die gewöhnlichste Entwicklungsarbeit der Welt ist. Ein paar Kleinigkeiten haben anfangs nicht funktioniert. Aber „Vibe Coding“ (ich hasse den Begriff) hat funktioniert. Ich weiß nur grob, wie mein Plugin funktioniert.

## Freud und Leid der LLMs

Die Unterschiede zwischen den großen proprietären Modellen auf den großen Servern und dem, was man lokal laufen lassen kann, sind gewaltig. Aber auch die Kosten.

Übergibt man des Schicksal seines NPCs dem GPT-5, ist fast alles gut. Der NPC verhält sich, wie man es von einem Menschen erwartet. Verfolgt Ziele auf vernünftige Weise, ist in der Lage, realistisch mit Gegenständen zu handeln, hält sich an Randbedingungen im Prompt. Allerdings ist das Modell sehr langsam - wer will 5 Sekunden auf jede Aktion warten? Und es ist sehr teuer. 

Ursprünglich habe ich ausschließlich mit Mistral Large gearbeitet. Das ist nicht ganz so clever wie GPT-5, aber viel schneller. Jede Sekunde eine Aktion. Fast brauchbar. Nach 3 Tagen herumspielen dann der Kostenschock: Ja, 2 NPCs, die pro Sekunde einen LLM Call machen, sind 120 Calls pro Minute, und wenn man ausführliche Prompts incl. Umgebungsbeschreibung, Gegenstände, Historie mitgibt, zahlt man für gar nicht so langes Testen 6 Euro. Witzigerweise ist Mistral Large teurer als GPT-5, und weil‘s auch nochmal fünfmal schneller ist, verfünffacht sich dieser Unterschied.

Im Anschließenden Rundumtest mit 11 LLMs zeigte sich, dass zum einen lokale Modelle sich nicht wirklich wie ein echter Mensch anfühlen und normale NPC-Aufgaben und Beschränkungen nicht bewältigen können, und zum anderen am ehesten GPT-5-mini den Preis-Leistungs-Kompromiss am Besten schafft. Wenn es nicht auch so langsam wäre - 5 Sekunden gehen für fast alle NPC-Situationen nicht.

Ich werde jetzt mal schauen, wie ich in einem echten kleinen Spiel damit vorankomme, aber ich fürchte, es muss noch die LLM-Ewigkeit von einem halben Jahr ins Land gehen, bis man RPGMaker-Spiele mit LLM-NPCs bauen kann, die auch Spaß machen. 

Unabhängig von den technischen Problem - Performance und Fähigkeiten der LLMs ist das ganz schön trickreich. Wenn die NPCs plötzlich eine große Handlungsfreiheit haben, wird es schwierig, eine stringente Handlung zu realisieren.



