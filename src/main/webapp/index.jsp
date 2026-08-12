<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html><html><head>
<title>CodeType — Code Faster. Have Fun.</title>
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/style.css">
</head><body class="landing">
<header class="nav">
<a class="logo" href="${pageContext.request.contextPath}/">Code<span>Type</span><i>•</i></a>
<nav><a href="#features">Features</a><a href="#levels">Levels</a><a href="#about">About</a><a class="nav-btn" href="${pageContext.request.contextPath}/test.jsp">Start Test</a></nav>
</header>
<main>
<section class="hero-shell">
<div class="hero-copy">
<div class="badge pulse-badge">⚡ CODING TYPING GAME</div>
<h1>Type code.<br><span>Beat your level.</span></h1>
<p>Build coding muscle memory, discover your weak keys, and survive a typing test that actually reacts to you.</p>
<div class="hero-actions"><a class="btn primary big" href="${pageContext.request.contextPath}/test.jsp">Start Typing →</a><a class="btn ghost big" href="#levels">Choose Level ↓</a></div>
<div class="mini-stats"><div><strong>10</strong><span>Levels</span></div><div><strong>6+</strong><span>Languages</span></div><div><strong>5</strong><span>Meme reactions</span></div></div>
</div>
<div class="hero-console">
<div class="window-top"><span></span><span></span><span></span><b>CodeType.exe</b></div>
<div class="fake-code">
<p><em>01</em> <span class="kw">public class</span> <span class="name">Coder</span> {</p>
<p><em>02</em> &nbsp;&nbsp;<span class="kw">public static void</span> main(String[] args) {</p>
<p><em>03</em> &nbsp;&nbsp;&nbsp;&nbsp;System.out.println(<span class="str">"Keep typing!"</span>);</p>
<p><em>04</em> &nbsp;&nbsp;}</p><p><em>05</em> }</p>
<div class="console-bottom"><span>WPM <b>58</b></span><span>ACC <b>97%</b></span><span class="live-dot">● LIVE</span></div>
</div></div>
</section>

<section id="levels" class="section">
<div class="section-heading"><div><div class="badge">🎮 YOU CHOOSE</div><h2>Pick your level.</h2><p>Start anywhere. You don't have to unlock levels in order.</p></div><a class="text-link" href="${pageContext.request.contextPath}/test.jsp">Open test →</a></div>
<div class="level-grid">
<% for(int i=1;i<=10;i++){ %>
<a class="level-card" href="${pageContext.request.contextPath}/test.jsp?level=<%=i%>">
<span class="level-number"><%=i%></span><div>
<b><%= i==1?"Warm Up":i==2?"Starter":i==3?"Learner":i==4?"Coder":i==5?"Pro Coder":i==6?"Speed Runner":i==7?"Code Ninja":i==8?"Speed Demon":i==9?"Elite":"Code Master" %></b>
<small><%= i<=3?"Easy syntax":i<=6?"Medium syntax":i<=8?"Hard syntax":"Challenge mode" %></small></div><span class="level-arrow">→</span>
</a>
<% } %>
</div></section>

<section id="features" class="section">
<div class="section-heading centered"><div class="badge">🔥 WHY CODETYPE?</div><h2>Not just a typing test.</h2><p>It watches your performance and turns practice into a game.</p></div>
<div class="feature-grid">
<div class="feature-card"><div class="feature-icon">⌨️</div><h3>Live WPM</h3><p>See speed and accuracy while you type.</p></div>
<div class="feature-card"><div class="feature-icon">🧠</div><h3>Weak Keys</h3><p>Find symbols and characters you keep missing.</p></div>
<div class="feature-card"><div class="feature-icon">🎭</div><h3>Meme Reactions</h3><p>Wrong, slow, fast or finished — CodeType reacts.</p></div>
<div class="feature-card"><div class="feature-icon">🏆</div><h3>Progress</h3><p>Save results and watch your typing improve.</p></div>
<div class="feature-card"><div class="feature-icon">⏱️</div><h3>Your Timer</h3><p>Choose a short challenge or longer practice.</p></div>
<div class="feature-card"><div class="feature-icon">🚀</div><h3>Skip Levels</h3><p>Jump directly to any level you want.</p></div>
</div></section>

<section class="cta"><div><div class="badge">READY?</div><h2>Let's see how fast you really type.</h2><p>Pick a level. Pick a timer. Then press start.</p></div><a class="btn primary big" href="${pageContext.request.contextPath}/test.jsp">Launch CodeType 🚀</a></section>
</main>
<footer id="about" class="footer"><div class="footer-main">
<div><a class="logo" href="${pageContext.request.contextPath}/">Code<span>Type</span><i>•</i></a><p class="footer-about">A Java Full Stack coding-typing game built with JSP, Servlet, JDBC and MySQL.</p></div>
<div class="footer-links"><b>About the Developer</b><p>Made with Java, curiosity and a little chaos. 😎</p>
<!-- Replace with your real LinkedIn profile URL. -->
<a class="linkedin-btn" href="https://www.linkedin.com/in/saneelgodage98/" target="_blank" rel="noopener noreferrer">in &nbsp; View LinkedIn Profile ↗</a></div>
</div><div class="footer-bottom"><span>© 2026 CodeType</span><span>Java • JSP • Servlet • JDBC • MySQL</span></div></footer>
</body></html>