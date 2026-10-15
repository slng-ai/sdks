// AUTO-GENERATED from specs/bridges-unmute/bridges-unmute.asyncapi.yaml
// Do not edit by hand. Run `bun run gen-ws-types` to regenerate.

/**
 * Optional session configuration sent before audio. Besides the fields below, any
 * provider-specific option declared by the selected model is passed through unchanged
 * (Deepgram-backed models also accept `punctuate`, `smart_format`, `diarize`, `numerals`,
 * `profanity_filter`). On SLNG-hosted Nova HTTP routes `smart_format=true` currently fails
 * upstream while `punctuate=true` works; WebSocket `smart_format` on hosted routes has not
 * been qualified.
 *
 * Base64 audio in a JSON text frame. The same bytes may instead be sent as raw binary
 * WebSocket frames; both forms are metered as input audio in the encoding declared by
 * `init`. Silent PCM advances the audio stream and is metered; use `keepalive` for silence
 * instead.
 *
 * Requests processing and leaves input open. Nova does not guarantee a response and does
 * not correlate results to this request: zero, one, or several final segments (including
 * empty ones) may follow, and a later result may carry `finalize_result: true` as
 * provenance only. Keep receiving and keep sending keepalives; do not pair finals with
 * finalize requests or implement a completion timeout. Use `close` for a complete input
 * stream.
 *
 * Signals that no more audio will be sent. The gateway forwards the provider's close-stream
 * control, keeps delivering every remaining result, and then closes the WebSocket with code
 * 1000. Successful closure after `close` is the only definitive completion signal; a final
 * transcript or utterance boundary alone is not. Use a new connection for the next
 * independent input.
 *
 * Carries no audio and produces no reply. For Nova, send every 3–5 seconds whenever input
 * remains open without audio; the provider ends idle streams after roughly ten seconds. The
 * gateway forwards it as the provider's native keepalive and resets its own idle timeout,
 * but it never extends the maximum session duration. A WebSocket ping is answered but is
 * not an application keepalive.
 *
 * Sent once after the upstream session is open. `session_id` and `slng_request_id` carry
 * the same gateway request identifier; quote it when reporting problems.
 *
 * Revisable segment text; replace provisional text with the latest partial. Only `type` and
 * `transcript` are always present.
 *
 * A finalized segment. Append nonempty text in arrival order and keep receiving: segment
 * finality does not close input or complete the stream, and an empty segment is never a
 * completion sentinel. Only `type` and `transcript` are always present. The gateway emits
 * no `duration`, `language`, or timing fields on this message; absent optional booleans
 * mean the provider did not report them (they are never filled with `false`).
 *
 * Emitted independently of `final_transcript` when the provider reports a word-gap
 * utterance boundary. It is not stream completion and does not cover queued audio. Nova
 * sends it only when `utterance_end_ms` is set together with `enable_partials: true`, with
 * `last_word_end` and `channel`; `stream_id` is supplied by Gradium only. Providers without
 * endpoint detection never send it.
 *
 * Flat error frame; there is no nested `data` envelope. Gateway-generated codes are
 * `config_error`, `processing_error`, `provider_error`, and `rate_limit` (oversize payloads
 * and message-rate breaches both report `rate_limit`); these and provider errors translated
 * by the gateway always carry `slng_request_id`. A provider frame that already has `type:
 * error` and that the provider's catalog does not declare is forwarded verbatim (reson8),
 * so `code` is then the provider's own value (possibly numeric) and `slng_request_id` is
 * absent. Branch on `code`, not on `message` text. Authentication failures are rejected at
 * the HTTP upgrade and never arrive as this message.
 *
 * Opens the provider session. The model comes from the route path; `model` in the body is
 * advisory and discarded. `config.encoding` and `config.sample_rate` are validated against
 * the selected model before any provider connection and rejected with a `config_error`
 * otherwise.
 *
 * Text for the current turn. `flush: true` ends the turn with this text. Set `partial:
 * true` on a frame that ends mid-sentence when more of the same sentence follows.
 *
 * Ends the current turn. Binary audio frames follow and the turn terminates with a bare
 * `audio_end`; there is no `flushed` acknowledgement.
 *
 * Cancels the active provider turn and discards queued output. The gateway replies with
 * `cleared`.
 *
 * Cancels the current synthesis turn without a dedicated acknowledgement; the session stays
 * open for the next turn.
 *
 * Ends the session after in-flight audio is delivered.
 *
 * Resets the gateway idle timeout and is forwarded upstream only for providers with a
 * native keepalive frame (Sarvam). It produces no reply and never extends the maximum
 * session duration.
 *
 * Sent once after the upstream session is open. `session_id` and `slng_request_id` carry
 * the same gateway request identifier.
 *
 * Synthesized audio is delivered only as raw binary WebSocket frames in the encoding and
 * sample rate selected at init. This is NOT a JSON message and there is no base64
 * `audio_chunk` envelope. The object schema below exists only because the AsyncAPI tooling
 * requires one.
 *
 * Acknowledges a client `clear`; queued provider output for the turn was discarded.
 *
 * Sent after the last binary audio frame of a flushed turn, on cache replay, and when the
 * provider transport closes cleanly. The frame is exactly `{"type":"audio_end"}`: no
 * `duration`, no payload, no nested `data`.
 *
 * Flat error frame; there is no nested `data` envelope. Provider errors are forwarded with
 * the provider's own `code` value (which may be numeric) or `provider_error` when the
 * provider gave none. Gateway-generated TTS session errors use string codes such as
 * `config_error`, `provider_error`, `rate_limit_exceeded`, `payload_too_large`,
 * `processing_error`, `watermarking_error`, `unsupported_watermark_format`, and
 * `invalid_pronunciation`. `slng_request_id` is present only on pronunciation errors; use
 * the `ready` message for correlation otherwise.
 */
export interface UnmuteWsMessage {
    /**
     * Session configuration. Each field applies only when the selected model declares it; only
     * `sample_rate` and `encoding` apply to every model. A field the model does not declare is
     * dropped without being validated or forwarded to the provider. Declared fields are
     * validated; for example, an empty `keyterm` array is rejected on Deepgram Nova.
     *
     * Synthesis configuration.
     */
    config?: Config;
    /**
     * Placeholder discriminator. The actual message is a raw binary WebSocket frame, not JSON.
     */
    type: Type;
    /**
     * Base64-encoded audio bytes.
     */
    data?: string;
    /**
     * Gateway request identifier for this session.
     */
    session_id?: string;
    /**
     * SLNG request identifier (same value as `session_id`) for log correlation.
     *
     * SLNG request identifier for log correlation; present on every gateway-generated or
     * gateway-translated error, absent on a verbatim provider passthrough.
     *
     * SLNG request identifier, present only on pronunciation errors.
     */
    slng_request_id?: string;
    /**
     * Provider confidence (0-1) when reported.
     */
    confidence?: number;
    /**
     * Present only when the provider attributes this result to finalize processing (Nova
     * `from_finalize`). Informational provenance; uncorrelated with any specific `finalize` and
     * not proof that all submitted audio was processed.
     */
    finalize_result?: boolean;
    /**
     * Interim text so far.
     *
     * Finalized segment text; may be an empty string.
     */
    transcript?: string;
    /**
     * Present only when the provider reports a speech endpoint for this result (Nova
     * `speech_final`). Not stream completion and not a turn acknowledgement.
     */
    utterance_final?: boolean;
    /**
     * Provider channel index for the boundary, when reported.
     */
    channel?: number[];
    /**
     * Audio timestamp in seconds of the last transcribed word, when reported.
     */
    last_word_end?: number;
    /**
     * Provider stream identifier (Gradium only).
     */
    stream_id?: number;
    /**
     * Error code. Gateway codes are strings; a verbatim provider passthrough keeps the
     * provider's value, which may be numeric.
     *
     * Error code. Gateway codes are strings; a provider-forwarded code keeps the provider's
     * value, which may be numeric.
     */
    code?: number | string;
    /**
     * Human-readable error description; wording may change.
     */
    message?: string;
    /**
     * Advisory and optional. Never honoured or forwarded; the route path selects the model.
     */
    model?: string;
    /**
     * Optional pronunciation rewrite. `mode` is always `rewrite`; supply exactly one of `name`
     * (a dictionary name, 1–128 characters) or `dictionary_id`.
     */
    pronunciation?: UnmuteWsMessagePronunciation;
    /**
     * Voice identifier for the selected model.
     */
    voice?: string;
    /**
     * Flush the turn immediately after this text.
     */
    flush?: boolean;
    /**
     * Marks this frame as the start or middle of a sentence that the next text frames continue.
     * The gateway either sends it on or holds it and sends it joined to the next frame,
     * whichever suits the provider. Held text is joined exactly as sent, with no added spaces.
     * Cannot be combined with `flush: true`. A frame with `partial: true` may contain only
     * `type`, `text`, `partial`, `pronunciation`, and `flush: false`. End the sentence with an
     * ordinary text frame or a `flush`; if the connection closes first, held text is discarded.
     * Where the gateway sends the fragment on, the provider receives it unchanged, so send at
     * least a clause at a time: single words can be voiced one at a time. Send `partial` only
     * when `ready` includes `accepts_partial_text: true`.
     */
    partial?: boolean;
    /**
     * Text to synthesize.
     */
    text?: string;
    /**
     * `true` when this gateway honours `partial` on text frames. Absent when it does not, in
     * which case do not send `partial`.
     */
    accepts_partial_text?: boolean;
    [property: string]: any;
}

/**
 * Session configuration. Each field applies only when the selected model declares it; only
 * `sample_rate` and `encoding` apply to every model. A field the model does not declare is
 * dropped without being validated or forwarded to the provider. Declared fields are
 * validated; for example, an empty `keyterm` array is rejected on Deepgram Nova.
 *
 * Synthesis configuration.
 */
export interface Config {
    /**
     * Input channel count. Optional on SLNG-hosted Nova routes (defaults to 1); used to meter
     * raw audio exactly.
     */
    channels?: number;
    /**
     * Enable interim `partial_transcript` results. Required for Nova `utterance_end` events.
     * Honoured by Deepgram Nova, Soniox, Speechmatics and Reson8; other models ignore it.
     */
    enable_partials?: boolean;
    /**
     * Input audio encoding. SLNG-hosted Nova routes accept `linear16` (8000/16000 Hz); other
     * targets may accept the remaining values.
     *
     * Union across bridge targets; each route accepts only its own subset. Deepgram Aura over
     * WebSocket accepts linear16, mulaw, and alaw only (mp3/opus/flac are HTTP-only for Aura).
     * Fish Audio accepts linear16 (alias of pcm), pcm, wav, mp3, and opus.
     */
    encoding?: Encoding;
    /**
     * Deepgram Nova only; other models ignore it (Soniox uses `enable_endpoint_detection` and
     * `max_endpoint_delay_ms`). Silence detector. Integer milliseconds of silence before a
     * segment is finalized, or `false` to disable. Controls segment finalization, not utterance
     * end.
     */
    endpointing?: any;
    /**
     * Keyterms to boost recognition on Deepgram Nova 3 models; other models ignore it.
     */
    keyterm?: string[];
    /**
     * Recognition language. Reson8 ignores it, and Sarvam Saaras ignores it in favour of
     * `language_code`.
     *
     * Optional language hint; models with automatic or voice-selected language accept and
     * ignore it.
     */
    language?: Language;
    /**
     * Must be supported by the selected model and encoding. Deepgram Aura over WebSocket:
     * linear16 accepts 8000/16000/24000/32000/48000, mulaw and alaw accept 8000/16000 (default
     * 24000). Fish Audio: linear16/pcm/wav accept 8000/16000/24000/32000/44100, mp3 accepts
     * 32000/44100, opus accepts 48000 only (default 44100, opus 48000).
     */
    sample_rate?: number;
    /**
     * Deepgram Nova only; other models ignore it. Word-gap detector in milliseconds that
     * produces `utterance_end` events. Requires `enable_partials: true`.
     */
    utterance_end_ms?: number;
    /**
     * Optional pronunciation rewrite. `mode` is always `rewrite`; supply exactly one of `name`
     * (a dictionary name, 1–128 characters) or `dictionary_id`.
     */
    pronunciation?: ConfigPronunciation;
    /**
     * Optional speaking-speed hint in the selected model's units; models without a speed
     * control accept and ignore it.
     */
    speed?: number;
    [property: string]: any;
}

/**
 * Input audio encoding. SLNG-hosted Nova routes accept `linear16` (8000/16000 Hz); other
 * targets may accept the remaining values.
 *
 * Union across bridge targets; each route accepts only its own subset. Deepgram Aura over
 * WebSocket accepts linear16, mulaw, and alaw only (mp3/opus/flac are HTTP-only for Aura).
 * Fish Audio accepts linear16 (alias of pcm), pcm, wav, mp3, and opus.
 */
export type Encoding = "linear16" | "LINEAR16" | "pcm_s16le" | "pcm_l16" | "pcm_raw" | "pcm_f32le" | "wav" | "mulaw" | "mp3" | "opus" | "alaw" | "flac" | "aac" | "pcm";

/**
 * Recognition language. Reson8 ignores it, and Sarvam Saaras ignores it in favour of
 * `language_code`.
 *
 * ISO-639-1 language code.
 *
 * Optional language hint; models with automatic or voice-selected language accept and
 * ignore it.
 */
export type Language = "en" | "ja" | "zh" | "de" | "hi" | "fr" | "ko" | "pt" | "it" | "es" | "id" | "nl" | "tr" | "fil" | "pl" | "sv" | "bg" | "ro" | "ar" | "cs" | "el" | "fi" | "hr" | "ms" | "sk" | "da" | "ta" | "uk" | "ru" | "hu" | "no" | "vi";

/**
 * Optional pronunciation rewrite. `mode` is always `rewrite`; supply exactly one of `name`
 * (a dictionary name, 1–128 characters) or `dictionary_id`.
 */
export interface ConfigPronunciation {
    dictionary_id?: string;
    mode:           Mode;
    name?:          string;
    [property: string]: any;
}

export type Mode = "rewrite";

/**
 * Optional pronunciation rewrite. `mode` is always `rewrite`; supply exactly one of `name`
 * (a dictionary name, 1–128 characters) or `dictionary_id`.
 */
export interface UnmuteWsMessagePronunciation {
    dictionary_id?: string;
    mode:           Mode;
    name?:          string;
    [property: string]: any;
}

export type Type = "init" | "audio" | "finalize" | "close" | "keepalive" | "ready" | "partial_transcript" | "final_transcript" | "utterance_end" | "error" | "text" | "flush" | "clear" | "cancel" | "binary" | "cleared" | "audio_end";
