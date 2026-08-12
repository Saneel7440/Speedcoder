<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>CodeType — Coding Typing Arena</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/style.css">
</head>
<body class="typing-body">

<div class="bg-symbols" aria-hidden="true">
    <span>{ }</span><span>&lt;/&gt;</span><span>;</span><span>()</span>
    <span>01</span><span>Java</span><span>API</span><span>SQL</span>
    <span>λ</span><span>&lt;/&gt;</span><span>{ }</span><span>;</span>
</div>

<header class="nav">
    <a class="logo" href="${pageContext.request.contextPath}/">Code<span>Type</span><i>•</i></a>
    <nav>
        <a href="${pageContext.request.contextPath}/">Home</a>
            </nav>
</header>

<main class="container test-page">

    <div class="arena-top">
        <div>
            <div class="badge">⚡ CODING TYPING ARENA</div>
            <h1>Type it. Don't break it.</h1>
            <p>Choose a level, press Start, and type the code exactly.</p>
        </div>

        <div class="level-chip">
            LEVEL <strong id="levelDisplay">1</strong> / 10
        </div>
    </div>

    <div class="controls">
        <div class="control-group">
            <label>LEVEL</label>
            <select id="levelSelect">
                <% for(int i=1;i<=10;i++){ %>
                    <option value="<%=i%>">Level <%=i%></option>
                <% } %>
            </select>
        </div>

        <div class="control-group">
            <label>LANGUAGE</label>
            <select id="languageSelect">
                <option>Java</option>
                <option>Python</option>
                <option>C++</option>
                <option>JavaScript</option>
                <option>SQL</option>
                <option>HTML</option>
            </select>
        </div>

        <div class="control-group">
            <label>TIME</label>
            <select id="durationSelect">
                <option value="30">30 sec</option>
                <option value="60" selected>60 sec</option>
                <option value="120">120 sec</option>
                <option value="300">5 min</option>
            </select>
        </div>

        <button class="btn custom-btn" id="customCodeBtn" type="button">📄 Custom Code</button>

        <label class="sound-toggle">
            <input type="checkbox" id="soundToggle" checked>
            🔊 Sounds
        </label>

        <div class="control-buttons">
            <button class="btn pause-btn" id="pauseBtn" type="button">⏸ Pause</button>
            <button class="btn restart-btn" id="restartBtn" type="button">↻ Restart</button>
        </div>
    </div>

    <section class="stats">
        <div><small>TIME</small><strong id="time">60</strong></div>
        <div><small>WPM</small><strong id="wpm">0</strong></div>
        <div><small>ACCURACY</small><strong id="accuracy">100%</strong></div>
        <div><small>MISTAKES</small><strong id="mistakes">0</strong></div>
    </section>

    <section class="typing-card" id="typingCard">

        <div class="code-label">
            <span id="codeLabel">Java</span>
            <span class="level-tag">LEVEL <b id="codeLevel">1</b></span>
        </div>

        <!-- Simple START overlay -->
        <div class="start-overlay" id="startOverlay">
            <div class="start-orbit">⌨️</div>
            <div class="start-badge">READY?</div>
            <h2 id="startTitle">Your challenge is ready.</h2>
            <p>Press Start and the timer begins immediately.</p>
            <button class="btn primary start-btn" id="startBtn" type="button">▶ START TYPING</button>
        </div>

        <div class="code-area" id="codeArea">
            <pre id="codeDisplay"></pre>
        </div>

        <div class="typing-input-wrap">
            <textarea
                id="typingInput"
                spellcheck="false"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                placeholder=""
                aria-label="Type the displayed code"></textarea>
        </div>

        <div class="progress">
            <div id="progressBar"></div>
        </div>

        <!-- Pause overlay -->
        <div class="pause-overlay hidden" id="pauseOverlay">
            <div class="pause-rings">
                <span>⏸</span>
            </div>
            <div class="badge">TIME FROZEN</div>
            <h2>Paused</h2>
            <p>Timer, typing and meme sounds are paused.</p>
            <button class="btn primary" id="resumeBtn" type="button">▶ RESUME</button>
        </div>

    </section>

    <section class="reaction" id="reactionBox">
        <div id="reactionEmoji">🎮</div>
        <div>
            <b id="reactionTitle">Ready?</b>
            <p id="reactionText">Press Start when you're ready.</p>
        </div>
    </section>

    <section class="mistake-flash" id="mistakeFlash">WRONG! 💥</section>

    <section class="results hidden" id="results">
        <div class="complete-banner">
            <div class="complete-crown">🏆</div>
            <div>
                <div class="badge">TEST COMPLETE</div>
                <h2>7 CRORE!</h2>
                <p id="completeSubtitle">You survived the challenge.</p>
            </div>
        </div>

        <div class="result-grid">
            <div><span>WPM</span><b id="finalWpm">0</b></div>
            <div><span>Accuracy</span><b id="finalAccuracy">0%</b></div>
            <div><span>Mistakes</span><b id="finalMistakes">0</b></div>
            <div><span>Characters</span><b id="finalCharacters">0</b></div>
        </div>

        <h3>🧠 Weak Keys</h3>
        <div id="weakKeys" class="weak-keys"></div>

        <form method="post" action="${pageContext.request.contextPath}/save-result">
            <input type="hidden" name="language" id="formLanguage">
            <input type="hidden" name="wpm" id="formWpm">
            <input type="hidden" name="accuracy" id="formAccuracy">
            <input type="hidden" name="mistakes" id="formMistakes">
            <input type="hidden" name="totalCharacters" id="formCharacters">
            <input type="hidden" name="duration" id="formDuration">

            <button class="btn primary" type="submit">Save Result</button>
            <button class="btn secondary" type="button" id="tryAgainBtn">Try Again</button>
        </form>
    </section>

</main>

<!-- CUSTOM CODE MODAL -->
<div class="modal-backdrop hidden" id="customModal">
    <div class="custom-modal">
        <button class="modal-close" id="closeCustomModal" type="button">×</button>

        <div class="badge">📄 CUSTOM CODE</div>
        <h2>Bring your own code.</h2>
        <p>Paste code below or upload a code file. We'll turn it into your typing challenge.</p>

        <textarea id="customCodeInput"
                  placeholder="Paste your code here...

Example:
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println(&quot;Hello CodeType!&quot;);
    }
}"></textarea>

        <div class="upload-row">
            <label class="file-btn">
                📁 Upload Code File
                <input type="file" id="customFileInput"
                       accept=".java,.py,.cpp,.c,.js,.ts,.sql,.html,.css,.txt,.jsp">
            </label>
            <span id="selectedFileName">No file selected</span>
        </div>

        <div class="modal-actions">
            <button class="btn secondary" id="cancelCustomBtn" type="button">Cancel</button>
            <button class="btn primary" id="useCustomBtn" type="button">Use This Code →</button>
        </div>

        <small class="modal-note">Your file is read locally in the browser; it is not uploaded to the server.</small>
    </div>
</div>

<script>
    window.CODETYPE_CONTEXT = "${pageContext.request.contextPath}";
    window.DEFAULT_LEVEL = "<%= request.getParameter("level")==null ? "1" : request.getParameter("level") %>";
</script>

<script src="${pageContext.request.contextPath}/assets/js/typing.js?v=4"></script>
</body>
</html>
