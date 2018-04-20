\documentclass[11pt]{article}
\title{Exercices - n<%- id %> }
\usepackage{etex}
\usepackage[french]{babel}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[dvipsnames]{xcolor}
\usepackage{amsmath,amssymb}
\usepackage{multicol}
\usepackage[top=1.5cm, bottom=2cm, left=1.8cm, right=1.8cm]{geometry}
%------entêtes------------------------
\usepackage{fancyhdr}
\usepackage{lastpage}
\chead{Exercices - <%- nom %> - n<%- id %> }
\lhead{}
\rhead{}
\renewcommand{\headrulewidth}{0.5mm}
\renewcommand{\footrulewidth}{0.5mm}
\cfoot{Page \thepage /\pageref{LastPage}}
\pagestyle{fancy}
%--------------------------------------
\usepackage{pstricks-add} % tracé de courbes
\usepackage{tikz}
\usepackage{tkz-tab}
\usetikzlibrary{arrows}
\usepackage{enumerate}
\usepackage{fancybox} % Pour les encadrés
\usepackage{gensymb}
\usepackage[np]{numprint}

\newcounter{numexo} %Création d'un compteur qui s'appelle numexo
\setcounter{numexo}{0} %initialisation du compteur
\newcommand{\exercice}[1]{
	\addtocounter{numexo}{1}
	\setlength {\fboxrule }{1pt}
	\vspace{5mm}
	\hspace{-1cm}\fcolorbox{black}{black!10}{\textbf{Exo \,\thenumexo\,} }\hspace{5mm}#1
	\vspace{5mm}
}

\frenchbsetup{StandardItemLabels=true} % bullets pour les items
\newcommand{\D}{\mathcal{D}}
\newcommand{\R}{\mathbb{R}}
\begin{document}
\raggedcolumns
\begin{multicols}{2}
<%
	var letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var recursive_fct = function(el, index){
		if (_.isArray(el)){
			_.each(el,recursive_fct);
		} else if((typeof el == "object")&&(el!==null)){
			switch (el.type){
				case "multicols" : %>
\begin{multicols}{<%- el.cols %>}
<%					_.each(el.children,recursive_fct); %>
\end{multicols}
<%					break;
				case "tableau": %>
\begin{center}
\begin{tabular}{<%= el.setup %>}
\hline <%
_.each(el.lignes, function(row){%>
	<%= row.join(" & ") %>\\
	\hline
<%}); %>\end{tabular}
\end{center}
<%					break;
				case "tikz":%>
\begin{center}
\begin{tikzpicture}[scale=<% if (el.scale){ %><%- el.scale %><% } else { %>1<% } %>, >=stealth]<%
if (el.index) { %>
\draw (<%- el.left %>,<%- el.top %>) node[below right,color=white,fill=black]{\textbf{<%- el.index %> }};<% } %>
\draw [color=black, line width=.1pt] (<%- el.left %> , <%- el.top %>) grid[step=<% if(el.step){%><%-el.step %><% } else { %>1<% } %>] (<%- el.right %>, <%- el.top %>);
<% if (el.axes){ %>\draw[line width=1pt] (0,0) node[below left, fill=white]{$O$} (<%- el.axes[0] %>,-2pt) node[below, fill=white]{\np{<%- el.axes[0] %>}} --++(0,4pt) (-2pt,<%- el.axes[1] %>) node[left, fill=white]{\np{<%- el.axes[1] %>}}--++(4pt,0);
\draw[line width=1.5pt](<%- el.left %>,0)--(<%- el.right %>,0) (0,<%- el.bottom %>)--(0,<%- el.top %>);
<% }
if (el.Ouv){ %>\draw[line width=1pt] (0,0) node[below left, fill=white]{$O$} (.5,0) node[below, fill=white]{\vec{u}} (0,.5) node[left, fill=white]{\vec{v}}
\draw[line width=1.5pt, <->](0,1)|-(1,0);
<% }
if (el.courbes) {%>
\begin{scope}
\clip (<%- el.left %>,<%- el.bottom %>) rectangle (<%- el.right %>, <%- el.top %>);
<% _.each(el.courbes, function(itCourbe){
%>	\draw[line width=2pt, color=<% if (itCourbe.color) { %><%- itCourbe.color %><% } else { %>black<% } %> ] plot[smooth, domain=<%- itCourbe.left | el.left %>:<%- itCourbe.right | el.right %>](\x,{<%- itCourbe.expression %>});
<% });
%>\end{scope}<% } %>
\end{tikzpicture}
\end{center}
<%					break;
				case "enumerate": %>
\begin{enumerate}<%if (el.enumi){%>[<%-el.enumi %>]<% } else {%>[1)]<% } %>
<% _.each(el.children, function(it, index){ %>\item <%recursive_fct(it, index); }); %>
\end{enumerate}
<%			}
		} else if (typeof el == "string") { %>
<%= el %>
<%		}
	}

	var fct = function(item){ %>

\exercice{<%-item.title%>}

<% if (item.message) {%><%- item.message %>
<% }
		_.each(item.children, recursive_fct);
	}

	_.each(exercices, fct);
%>
\end{multicols}
\end{document}
