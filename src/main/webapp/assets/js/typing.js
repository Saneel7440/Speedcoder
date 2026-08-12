/* =========================================================
   CODETYPE V4 — CLEAN TYPING ENGINE
   Start overlay + custom code + pause/resume audio
   ========================================================= */

const snippets = {
    Java: [
`public class UserService {
    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final AuditService auditService;

    public UserService(UserRepository repository,
                       PasswordEncoder encoder,
                       AuditService auditService) {
        this.repository = repository;
        this.encoder = encoder;
        this.auditService = auditService;
    }

    public User register(String email, String password) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email required");
        }

        if (repository.existsByEmail(email)) {
            throw new UserAlreadyExistsException(email);
        }

        String hash = encoder.encode(password);
        User user = new User(email, hash, Role.USER);

        User saved = repository.save(user);
        auditService.record("USER_CREATED", saved.getId());

        return saved;
    }

    public Optional<User> find(String id) {
        return repository.findById(id);
    }

    public void delete(String id) {
        repository.deleteById(id);
        auditService.record("USER_DELETED", id);
    }
}`,

`public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentGateway paymentGateway;
    private final NotificationService notificationService;

    public OrderService(OrderRepository orderRepository,
                        PaymentGateway paymentGateway,
                        NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.paymentGateway = paymentGateway;
        this.notificationService = notificationService;
    }

    @Transactional
    public Order placeOrder(OrderRequest request) {
        validate(request);

        Order order = Order.builder()
                .customerId(request.customerId())
                .items(request.items())
                .status(OrderStatus.CREATED)
                .createdAt(Instant.now())
                .build();

        Order saved = orderRepository.save(order);
        paymentGateway.authorize(saved.total());

        notificationService.send(
                saved.customerId(),
                "Order " + saved.id() + " created"
        );

        return saved;
    }

    private void validate(OrderRequest request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("Order cannot be empty");
        }
    }
}`,

`public List<User> findActiveUsers(List<User> users) {
    return users.stream()
            .filter(Objects::nonNull)
            .filter(User::isActive)
            .filter(user -> user.getEmail() != null)
            .sorted(Comparator.comparing(User::getCreatedAt).reversed())
            .map(this::sanitize)
            .toList();
}

private User sanitize(User user) {
    return user.toBuilder()
            .passwordHash(null)
            .build();
}`,

`public Map<String, Long> countByDepartment(List<Employee> employees) {
    return employees.stream()
            .filter(Objects::nonNull)
            .filter(Employee::isActive)
            .collect(Collectors.groupingBy(
                    Employee::department,
                    TreeMap::new,
                    Collectors.counting()
            ));
}`,

`CompletableFuture<List<User>> loadUsersAsync() {
    return CompletableFuture
            .supplyAsync(repository::findAll)
            .thenApply(users -> users.stream()
                    .filter(User::isActive)
                    .sorted(Comparator.comparing(User::getName))
                    .toList())
            .exceptionally(error -> {
                logger.error("Unable to load users", error);
                return List.of();
            });
}`,

`public record ApiResponse<T>(
        boolean success,
        T data,
        String message,
        Instant timestamp) {

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(
                true,
                data,
                "OK",
                Instant.now()
        );
    }

    public static <T> ApiResponse<T> failure(String message) {
        return new ApiResponse<>(
                false,
                null,
                message,
                Instant.now()
        );
    }
}`,

`public class RateLimiter {
    private final ConcurrentHashMap<String, AtomicInteger> requests =
            new ConcurrentHashMap<>();

    public boolean allow(String clientId, int limit) {
        AtomicInteger counter = requests.computeIfAbsent(
                clientId,
                key -> new AtomicInteger()
        );

        int current = counter.incrementAndGet();

        if (current > limit) {
            counter.decrementAndGet();
            return false;
        }

        return true;
    }

    public void reset(String clientId) {
        requests.remove(clientId);
    }
}`,

`public Optional<BigDecimal> calculateDiscount(
        Customer customer,
        List<CartItem> items) {

    if (customer == null || items == null || items.isEmpty()) {
        return Optional.empty();
    }

    BigDecimal total = items.stream()
            .map(CartItem::price)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal discount = customer.isPremium()
            ? total.multiply(new BigDecimal("0.15"))
            : total.multiply(new BigDecimal("0.05"));

    return Optional.of(discount.setScale(2, RoundingMode.HALF_UP));
}`,

`@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers(
            @RequestParam(required = false) String search) {

        List<UserResponse> users = service.search(search)
                .stream()
                .map(UserResponse::from)
                .toList();

        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(
            @Valid @RequestBody CreateUserRequest request) {

        User user = service.register(
                request.email(),
                request.password()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserResponse.from(user));
    }
}`,

`public final class CacheService<K, V> {
    private final ConcurrentHashMap<K, CacheEntry<V>> cache =
            new ConcurrentHashMap<>();

    public void put(K key, V value, Duration ttl) {
        Instant expiresAt = Instant.now().plus(ttl);
        cache.put(key, new CacheEntry<>(value, expiresAt));
    }

    public Optional<V> get(K key) {
        CacheEntry<V> entry = cache.get(key);

        if (entry == null) {
            return Optional.empty();
        }

        if (Instant.now().isAfter(entry.expiresAt())) {
            cache.remove(key);
            return Optional.empty();
        }

        return Optional.of(entry.value());
    }

    private record CacheEntry<V>(
            V value,
            Instant expiresAt) {}
}`
    ],

    Python: [
`from dataclasses import dataclass
from typing import Iterable

@dataclass(frozen=True)
class User:
    name: str
    score: float
    active: bool = True

def top_users(users: Iterable[User]) -> list[User]:
    return sorted(
        (
            user
            for user in users
            if user.active and user.score >= 80
        ),
        key=lambda user: user.score,
        reverse=True
    )`,

`async def fetch_users(session, urls):
    tasks = [
        session.get(url)
        for url in urls
    ]

    responses = await asyncio.gather(
        *tasks,
        return_exceptions=True
    )

    return [
        await response.json()
        for response in responses
        if not isinstance(response, Exception)
    ]`,

`class UserRepository:
    def __init__(self, connection):
        self.connection = connection

    def find_active(self):
        query = """
            SELECT id, email, score
            FROM users
            WHERE active = TRUE
            ORDER BY score DESC
        """

        with self.connection.cursor() as cursor:
            cursor.execute(query)
            return cursor.fetchall()

    def save(self, user):
        with self.connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO users(email, score) VALUES (%s, %s)",
                (user.email, user.score)
            )
        self.connection.commit()`,

`def calculate_statistics(values):
    if not values:
        return {
            "count": 0,
            "average": 0,
            "minimum": None,
            "maximum": None
        }

    total = sum(values)

    return {
        "count": len(values),
        "average": total / len(values),
        "minimum": min(values),
        "maximum": max(values)
    }`,

`def group_transactions(transactions):
    result = defaultdict(list)

    for transaction in transactions:
        if transaction["status"] != "COMPLETED":
            continue

        customer_id = transaction["customer_id"]
        result[customer_id].append(transaction)

    return {
        customer: sorted(
            items,
            key=lambda item: item["created_at"],
            reverse=True
        )
        for customer, items in result.items()
    }`
    ],

    "C++": [
`class UserService {
private:
    std::shared_ptr<UserRepository> repository;

public:
    explicit UserService(
        std::shared_ptr<UserRepository> repository)
        : repository(std::move(repository)) {}

    std::optional<User> findById(const std::string& id) {
        return repository->findById(id);
    }

    void remove(const std::string& id) {
        repository->deleteById(id);
    }
};`,

`template <typename T>
T maxValue(const std::vector<T>& values) {
    if (values.empty()) {
        throw std::invalid_argument("empty collection");
    }

    return *std::max_element(
        values.begin(),
        values.end()
    );
}`,

`std::vector<int> result;

std::copy_if(
    numbers.begin(),
    numbers.end(),
    std::back_inserter(result),
    [](int value) {
        return value % 2 == 0;
    }
);

std::transform(
    result.begin(),
    result.end(),
    result.begin(),
    [](int value) {
        return value * value;
    }
);`,

`class ConnectionPool {
private:
    std::mutex mutex;
    std::condition_variable condition;
    std::queue<std::shared_ptr<Connection>> connections;

public:
    std::shared_ptr<Connection> acquire() {
        std::unique_lock<std::mutex> lock(mutex);

        condition.wait(lock, [this] {
            return !connections.empty();
        });

        auto connection = connections.front();
        connections.pop();

        return connection;
    }
};`
    ],

    JavaScript: [
`class UserService {
    #repository;
    #cache;

    constructor(repository, cache) {
        this.#repository = repository;
        this.#cache = cache;
    }

    async findById(id) {
        const cached = await this.#cache.get(id);

        if (cached) {
            return cached;
        }

        const user = await this.#repository.findById(id);

        if (user) {
            await this.#cache.set(id, user);
        }

        return user;
    }
}`,

`function debounce(callback, delay) {
    let timer;

    return (...args) => {
        clearTimeout(timer);

        timer = setTimeout(
            () => callback(...args),
            delay
        );
    };
}`,

`const result = users
    .filter(user => user?.active === true)
    .filter(user => user.score >= 80)
    .map(user => ({
        id: user.id,
        name: user.name,
        score: user.score
    }))
    .sort((a, b) => b.score - a.score);`,

`async function loadDashboard() {
    const [users, orders, analytics] =
        await Promise.all([
            fetch("/api/users").then(r => r.json()),
            fetch("/api/orders").then(r => r.json()),
            fetch("/api/analytics").then(r => r.json())
        ]);

    return {
        users,
        orders,
        analytics
    };
}`
    ],

    SQL: [
`WITH ranked_employees AS (
    SELECT
        name,
        department,
        salary,
        DENSE_RANK() OVER (
            PARTITION BY department
            ORDER BY salary DESC
        ) AS salary_rank
    FROM employees
)
SELECT *
FROM ranked_employees
WHERE salary_rank <= 3
ORDER BY department, salary_rank;`,

`WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', created_at) AS month,
        customer_id,
        SUM(amount) AS total
    FROM orders
    WHERE status = 'COMPLETED'
    GROUP BY
        DATE_TRUNC('month', created_at),
        customer_id
)
SELECT
    month,
    COUNT(DISTINCT customer_id) AS customers,
    SUM(total) AS revenue,
    AVG(total) AS average_order_value
FROM monthly_sales
GROUP BY month
ORDER BY month DESC;`,

`SELECT
    d.department_name,
    COUNT(e.id) AS employee_count,
    ROUND(AVG(e.salary), 2) AS average_salary,
    MAX(e.salary) AS highest_salary
FROM departments d
LEFT JOIN employees e
    ON e.department_id = d.id
GROUP BY d.department_name
HAVING COUNT(e.id) > 2
ORDER BY average_salary DESC;`,

`CREATE INDEX idx_orders_customer_status
ON orders(customer_id, status);

SELECT
    customer_id,
    COUNT(*) AS order_count,
    SUM(amount) AS total_spent
FROM orders
WHERE status = 'COMPLETED'
GROUP BY customer_id
HAVING SUM(amount) > 10000
ORDER BY total_spent DESC;`
    ],

    HTML: [
`<main class="dashboard">
    <header class="topbar">
        <a href="/">CodeType</a>
        <nav>
            <a href="/practice">Practice</a>
            <a href="/history">History</a>
        </nav>
    </header>

    <section class="hero">
        <h1>Master coding speed.</h1>
        <p>Practice real code instead of random words.</p>
        <button class="btn">Start Challenge</button>
    </section>
</main>`,

`<form class="login-form" action="/login" method="post">
    <label for="email">Email</label>
    <input
        id="email"
        name="email"
        type="email"
        autocomplete="email"
        required
    >

    <label for="password">Password</label>
    <input
        id="password"
        name="password"
        type="password"
        autocomplete="current-password"
        required
    >

    <button type="submit">Sign In</button>
</form>`
    ]
};

const audioFiles = {
    wrong: "assets/audio/fahaaa.mp3",
    slow: "assets/audio/bhag_bhag.mp3",
    manyWrong: "assets/audio/tum_se_nahi_ho_payega.mp3",
    fast: "assets/audio/hype.mp3",
    complete: "assets/audio/7_crore.mp3"
};

const $ = id => document.getElementById(id);

const state = {
    language: "Java",
    level: 1,
    duration: 60,
    remaining: 60,
    snippet: "",
    customCode: false,
    started: false,
    paused: false,
    finished: false,
    timer: null,
    lastWrong: 0,
    slowSince: null,
    lastSlow: 0,
    many: false,
    fast: false,
    currentAudio: null
};

function esc(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function normalizeCode(text) {
    return String(text)
        .split("\n")
        .map(line => line.replace(/^\\s+/, ""))
        .join("\n")
        .trimEnd();
}

function render() {
    const typed = $("typingInput").value;
    let html = "";

    for (let i = 0; i < state.snippet.length; i++) {
        const character = state.snippet[i];
        let className = "";

        if (i < typed.length) {
            className = typed[i] === character ? "correct" : "wrong";
        } else if (i === typed.length && state.started) {
            className = "current";
        }

        html += `<span class="${className}">${esc(character)}</span>`;
    }

    $("codeDisplay").innerHTML = html;
}

function metrics() {
    const typed = $("typingInput").value;
    let correct = 0;
    let mistakes = 0;

    for (let i = 0; i < typed.length; i++) {
        if (i < state.snippet.length && typed[i] === state.snippet[i]) {
            correct++;
        } else {
            mistakes++;
        }
    }

    const elapsed = Math.max(
        1,
        state.duration - state.remaining
    );

    return {
        typed,
        correct,
        mistakes,
        elapsed,
        wpm: Math.round((correct / 5) / (elapsed / 60)),
        accuracy: typed.length
            ? (correct / typed.length) * 100
            : 100
    };
}

function playSound(type) {
    if (!$("soundToggle").checked) return;

    stopSound();

    const audio = new Audio(
        `${window.CODETYPE_CONTEXT}/${audioFiles[type]}`
    );

    audio.volume = 0.8;
    state.currentAudio = audio;

    audio.play().catch(() => {});
}

function stopSound() {
    if (!state.currentAudio) return;

    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
    state.currentAudio = null;
}

function pauseSound() {
    if (state.currentAudio) {
        state.currentAudio.pause();
    }
}

function resumeSound() {
    if (state.currentAudio) {
        state.currentAudio.play().catch(() => {});
    }
}

function react(emoji, title, message, audioType) {
    $("reactionEmoji").textContent = emoji;
    $("reactionTitle").textContent = title;
    $("reactionText").textContent = message;

    $("reactionBox").classList.remove("reaction-pop");
    void $("reactionBox").offsetWidth;
    $("reactionBox").classList.add("reaction-pop");

    if (audioType) {
        playSound(audioType);
    }
}

function wrongAnimation() {
    $("typingCard").classList.remove("wrong-shake");
    void $("typingCard").offsetWidth;
    $("typingCard").classList.add("wrong-shake");

    $("mistakeFlash").classList.remove("flash-show");
    void $("mistakeFlash").offsetWidth;
    $("mistakeFlash").classList.add("flash-show");
}

function levelAnimation() {
    document.body.classList.remove("level-change");
    void document.body.offsetWidth;
    document.body.classList.add("level-change");

    $("levelDisplay").classList.remove("level-pop");
    void $("levelDisplay").offsetWidth;
    $("levelDisplay").classList.add("level-pop");
}

function stats() {
    const m = metrics();

    $("wpm").textContent = m.wpm;
    $("accuracy").textContent = m.accuracy.toFixed(1) + "%";
    $("mistakes").textContent = m.mistakes;

    $("progressBar").style.width =
        Math.min(
            100,
            (m.typed.length / state.snippet.length) * 100
        ) + "%";

    if (m.mistakes > state.lastWrong) {
        state.lastWrong = m.mistakes;
        wrongAnimation();

        react(
            "💀",
            "FAHAAA!",
            "Bro... that character was NOT it.",
            "wrong"
        );
    }

    if (m.mistakes >= 10 && !state.many) {
        state.many = true;

        react(
            "😭",
            "TUM SE NAHI HO PAYEGA!",
            "10+ mistakes. Comeback time.",
            "manyWrong"
        );
    }

    if (
        m.wpm >= 50 &&
        m.accuracy >= 95 &&
        !state.fast
    ) {
        state.fast = true;

        react(
            "🔥",
            "BRO IS COOKING!",
            "That speed is actually dangerous.",
            "fast"
        );
    }

    // SLOW MEME:
    // Trigger only when WPM drops BELOW 10.
    // If WPM rises ABOVE 10, stop the meme immediately.
    if (
        state.started &&
        !state.paused &&
        m.wpm < 10 &&
        m.typed.length > 0
    ) {
        if (!state.slowSince) {
            state.slowSince = Date.now();
        }

        // Give the typer 3 seconds of genuinely slow typing
        // before playing the meme.
        if (
            Date.now() - state.slowSince >= 3000 &&
            Date.now() - state.lastSlow > 8000
        ) {
            state.lastSlow = Date.now();

            react(
                "🐌",
                "BHAG BHAG DK BOSE!",
                "Speed up! You're below 10 WPM 😭",
                "slow"
            );
        }
    } else {
        // The moment WPM reaches 10 or more,
        // reset the slow counter and stop any current slow meme.
        state.slowSince = null;

        if (m.wpm >= 10 && state.currentAudio) {
            state.currentAudio.pause();
            state.currentAudio.currentTime = 0;
            state.currentAudio = null;
        }
    }
}

function startTest() {
    if (state.started || state.finished) return;

    state.started = true;
    state.paused = false;

    $("startOverlay").classList.add("hidden");
    $("typingInput").disabled = false;
    $("typingInput").focus();

    document.body.classList.add("typing-active");

    state.timer = setInterval(() => {
        if (state.paused || state.finished) return;

        state.remaining--;
        $("time").textContent = state.remaining;

        stats();

        if (state.remaining <= 0) {
            finish();
        }
    }, 1000);
}

function pauseTest() {
    if (!state.started || state.finished || state.paused) return;

    state.paused = true;

    $("typingInput").disabled = true;
    $("pauseOverlay").classList.remove("hidden");

    $("pauseBtn").textContent = "▶ Resume";

    document.body.classList.add("game-paused");
    pauseSound();

    react(
        "⏸️",
        "PAUSED",
        "Timer, typing and sound are frozen."
    );
}

function resumeTest() {
    if (!state.started || state.finished || !state.paused) return;

    state.paused = false;

    $("typingInput").disabled = false;
    $("pauseOverlay").classList.add("hidden");

    $("pauseBtn").textContent = "⏸ Pause";

    document.body.classList.remove("game-paused");

    $("typingInput").focus();
    resumeSound();

    react(
        "▶️",
        "BACK TO WORK!",
        "Let's cook some code 🔥"
    );
}

function resetTest() {
    clearInterval(state.timer);
    stopSound();

    state.remaining = state.duration;
    state.snippet = normalizeCode(state.customCode
        ? state.snippet
        : snippets[state.language][state.level - 1]);

    state.started = false;
    state.paused = false;
    state.finished = false;
    state.lastWrong = 0;
    state.slowSince = null;
    state.lastSlow = 0;
    state.many = false;
    state.fast = false;

    $("time").textContent = state.remaining;
    $("wpm").textContent = "0";
    $("accuracy").textContent = "100%";
    $("mistakes").textContent = "0";
    $("progressBar").style.width = "0%";

    $("typingInput").value = "";
    $("typingInput").disabled = true;

    $("pauseOverlay").classList.add("hidden");
    $("startOverlay").classList.remove("hidden");

    $("pauseBtn").textContent = "⏸ Pause";

    $("results").classList.add("hidden");

    $("levelDisplay").textContent = state.level;
    $("codeLevel").textContent = state.level;
    $("codeLabel").textContent = state.customCode
        ? "CUSTOM CODE"
        : state.language;

    render();

    document.body.classList.remove(
        "typing-active",
        "game-paused"
    );

    react(
        "🎮",
        "READY?",
        state.customCode
            ? "Your custom code is loaded. Press Start."
            : `Level ${state.level}. Press Start when you're ready.`
    );
}

function weakKeys() {
    const typed = $("typingInput").value;
    const expected = state.snippet;
    const errors = {};

    for (let i = 0; i < typed.length; i++) {
        if (
            i < expected.length &&
            typed[i] !== expected[i]
        ) {
            const key =
                expected[i] === " "
                    ? "SPACE"
                    : expected[i];

            errors[key] = (errors[key] || 0) + 1;
        }
    }

    const sorted = Object.entries(errors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

    $("weakKeys").innerHTML = sorted.length
        ? sorted
            .map(
                ([key, count]) =>
                    `<span class="weak-key">${esc(key)} × ${count}</span>`
            )
            .join("")
        : "<span class='weak-key'>No weak keys 🎯</span>";
}

function finish() {
    if (state.finished) return;

    state.finished = true;
    clearInterval(state.timer);
    stopSound();

    $("typingInput").disabled = true;

    const m = metrics();

    $("finalWpm").textContent = m.wpm;
    $("finalAccuracy").textContent =
        m.accuracy.toFixed(1) + "%";
    $("finalMistakes").textContent =
        m.mistakes;
    $("finalCharacters").textContent =
        m.typed.length;

    $("formLanguage").value =
        state.customCode
            ? "CUSTOM"
            : state.language;

    $("formWpm").value = m.wpm;
    $("formAccuracy").value =
        m.accuracy.toFixed(2);
    $("formMistakes").value =
        m.mistakes;
    $("formCharacters").value =
        m.typed.length;
    $("formDuration").value =
        state.duration;

    weakKeys();

    $("completeSubtitle").textContent =
        `Level ${state.level} complete. You survived the challenge.`;

    $("results").classList.remove("hidden");

    react(
        "💰",
        "7 CRORE!",
        "Test complete. Amitabh ji approves.",
        "complete"
    );

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
}

/* ---------- LEVEL ---------- */

$("levelSelect").onchange = () => {
    if (state.started) {
        $("levelSelect").value = state.level;

        react(
            "ℹ️",
            "RESTART FIRST",
            "Finish or restart the current challenge first."
        );

        return;
    }

    state.customCode = false;
    state.level = +$("levelSelect").value;

    levelAnimation();
    resetTest();
};

/* ---------- LANGUAGE ---------- */

$("languageSelect").onchange = () => {
    if (state.started) {
        $("languageSelect").value = state.language;

        react(
            "ℹ️",
            "RESTART FIRST",
            "Restart before changing language."
        );

        return;
    }

    state.customCode = false;
    state.language = $("languageSelect").value;

    levelAnimation();
    resetTest();
};

/* ---------- TIMER ---------- */

$("durationSelect").onchange = () => {
    if (state.started) {
        $("durationSelect").value =
            state.duration;

        react(
            "ℹ️",
            "RESTART FIRST",
            "Restart before changing the timer."
        );

        return;
    }

    state.duration = +$("durationSelect").value;
    resetTest();
};

/* ---------- START ---------- */

$("startBtn").onclick = startTest;

/* ---------- PAUSE ---------- */

$("pauseBtn").onclick = () => {
    if (state.paused) {
        resumeTest();
    } else {
        pauseTest();
    }
};

$("resumeBtn").onclick = resumeTest;

/* ---------- RESTART ---------- */

$("restartBtn").onclick = resetTest;

$("tryAgainBtn").onclick = resetTest;

/* ---------- TYPING ---------- */

$("typingInput").oninput = () => {
    if (
        !state.started ||
        state.paused ||
        state.finished
    ) {
        return;
    }

    render();
    stats();

    if (
        $("typingInput").value.length >=
        state.snippet.length
    ) {
        finish();
    }
};

/* =========================================================
   CUSTOM CODE
   ========================================================= */

const customModal = $("customModal");
const customInput = $("customCodeInput");
const customFile = $("customFileInput");

$("customCodeBtn").onclick = () => {
    customModal.classList.remove("hidden");
    customInput.focus();
};

function closeCustomModal() {
    customModal.classList.add("hidden");
}

$("closeCustomModal").onclick = closeCustomModal;
$("cancelCustomBtn").onclick = closeCustomModal;

customModal.onclick = event => {
    if (event.target === customModal) {
        closeCustomModal();
    }
};

customFile.onchange = () => {
    const file = customFile.files[0];

    if (!file) {
        $("selectedFileName").textContent =
            "No file selected";
        return;
    }

    $("selectedFileName").textContent =
        file.name;

    const reader = new FileReader();

    reader.onload = event => {
        customInput.value =
            event.target.result;
    };

    reader.readAsText(file);
};

$("useCustomBtn").onclick = () => {
    const code = customInput.value;

    if (!code.trim()) {
        alert("Please paste code or upload a code file.");
        return;
    }

    state.customCode = true;
    state.snippet = normalizeCode(code);

    $("levelDisplay").textContent = "CUSTOM";
    $("codeLevel").textContent = "CUSTOM";
    $("codeLabel").textContent = "CUSTOM CODE";

    closeCustomModal();

    resetTest();

    $("levelDisplay").textContent = "CUSTOM";
    $("codeLevel").textContent = "CUSTOM";
    $("codeLabel").textContent = "CUSTOM CODE";

    react(
        "📄",
        "CUSTOM CODE LOADED!",
        "Your code is ready. Press Start."
    );
};

/* =========================================================
   INITIAL STATE
   ========================================================= */

state.level = Math.min(
    10,
    Math.max(
        1,
        +window.DEFAULT_LEVEL || 1
    )
);

$("levelSelect").value =
    state.level;

state.language =
    $("languageSelect").value;

state.duration =
    +$("durationSelect").value;

state.remaining =
    state.duration;

state.snippet = normalizeCode(
    snippets[state.language][state.level - 1]
);

$("levelDisplay").textContent =
    state.level;

$("codeLevel").textContent =
    state.level;

$("time").textContent =
    state.remaining;

$("typingInput").disabled = true;

render();
