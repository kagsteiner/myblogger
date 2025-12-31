# Wie gut schreiben aktuelle AIs eine Go App?

Vor etwa einem halben Jahr waren "denkende" LLMs neu. Damals habe ich den aktuellen Modellen folgende Aufgabe gestellt:

Schritt 1: schreibe ein einfaches Go-Programm:

"You are an expert python developer with focus on applying AI. Please write a python app with a Tk interface for a full go-playing application where the player and computer play against each other on a go board."
 
Schritt 2: füge ein wenig AI hinzu: 
 
"Let’s try out our own simple AI that is suitable for such a project but not as simple as random moves.

The groundwork for our AI is the understanding of influence of groups on neighboring (and more distant) cells. We should compute an influence map of white and black stones on the board. Can you suggest how to do this?"

Schritt 3: ein wenig mehr AI:

Thank you. Can you suggest changes needed to not calculate the influence for every point and place a stone where you find the optimum influence, but to calculate how much the overall influence would change if there were a stone at that point?

Schritt 4: Noch mehr AI: 

I would like to enhance the AI so that it doesn’t only take influence into account but other factors as well. Ideally I would like to compute several scores for each of the 19x19 points, where influence change is one, adding to a shape’s liveness is another, etc. Please suggest how to refactor the code so that an AI implementation defines a 19x19 score area and fills it with zeros, and then can call a number of functions to add to these values, and in the end pick the point of the area with the highest score, starting with the current influence-based score?

Und schließlich: 

Can you add one more scoring that checks whether a move can capture a group of the opponent and adds value according to the size of the captured group?

In https://medium.com/@karlheinz.agsteiner/developing-a-simple-go-game-with-thinking-llms-a-comparison-3b1646d35ee4 habe ich, damals noch medium verwendet, meine Ergebnisse aufgeschrieben. Claude 3.7 und Gemini 2.5 pro lagen ziemlich gleichauf.

## Die Kandidaten

In der letzten Welle neuer Veröffentlichungen erschienen folgende Top-Models auf der Bühne:

* Gemini 3.0 pro zusammen mit einer eigenen Entwicklungsumgebung namens AntiGravity, die genau wie Cursor aussieht.
* Claude 4.5 sonnet (verwende ich in Cursor)
* GPT 5.1 (verwende ich in Cursor)

### Gemini 3.0

Viel Hype umgibt das gerade erschienene Gemini 3.0. Entwickelt wie ein Senior Developer, liest man. Schaun wir mal.

Rein technisch löst die AI die 5 Aufgaben wunderbar. Sie baut eine fehlerfreie Go-App, die alle Go-Regeln incl. schlagen größerer Gruppen, KO-Regel, Selbstmordregel kennt. 

Allerdings spielt die AI, die die AI schreibt, wirklich sehr schlechtes Go, unter dem Niveau jedes Anfängers. Aus irgendeinem Grund hat das Gemini 2.5 besser hin bekommen.