// AUTO-GENERATED from specs/bridges-unmute/bridges-unmute.asyncapi.yaml
// Do not edit by hand. Run `bun run gen-ws-types` to regenerate.

/**
 * Error occurred during synthesis.
 *
 * Indicates all audio has been sent for the current synthesis.
 *
 * Confirms that buffered audio has been cleared.
 *
 * Confirms that all buffered audio has been sent.
 *
 * Indicates the end of a synthesis segment.
 *
 * Indicates the start of a new synthesis segment.
 *
 * Synthesized audio chunk.
 *
 * Session is ready for text input.
 *
 * Close the current synthesis session and stop any further audio.
 *
 * Clear any buffered audio without sending.
 *
 * Flush any buffered audio to the client.
 *
 * Text to synthesize into audio.
 *
 * Initialize TTS session with voice and configuration.
 *
 * Error occurred during transcription.
 *
 * Final transcription result for an utterance.
 *
 * Signals the end of an utterance. Emitted by the bridge when the
 * upstream provider returns a final endpoint marker (e.g., Soniox
 * `<end>` / `<fin>` tokens). Requires the model's catalog to declare
 * a `tokenStream` with `finalMarkers`, and endpoint detection to be
 * enabled in the session config.
 *
 *
 * Interim transcription result.
 *
 * Session is ready for audio input.
 *
 * Prevents the connection from being closed due to inactivity. Send periodically during
 * silence to maintain the session.
 *
 * Signal that no more audio will be sent. The server processes remaining audio, sends final
 * results, then closes the connection.
 *
 * Mid-stream flush — forces the server to finalize any buffered audio and return results.
 * The connection remains open for further audio.
 *
 * Audio data for transcription.
 *
 * Initialize STT session with optional configuration.
 */
export interface UnmuteWsMessage {
    /**
     * Error code.
     */
    code?: Code;
    /**
     * Human-readable error description.
     */
    message?: string;
    type:     Type;
    /**
     * Total audio duration in seconds.
     *
     * Audio duration in seconds.
     */
    duration?: number;
    /**
     * Unique segment identifier.
     */
    segment_id?: string;
    /**
     * Base64-encoded audio data.
     */
    data?: string;
    /**
     * Sequence number of the audio chunk.
     */
    sequence?: number;
    /**
     * Unique session identifier.
     */
    session_id?: string;
    /**
     * Whether to flush immediately after this text.
     */
    flush?: boolean;
    /**
     * Text to synthesize.
     */
    text?: string;
    /**
     * Synthesis configuration.
     *
     * Session configuration.
     */
    config?: Config;
    /**
     * Voice identifier.
     */
    voice?: string;
    /**
     * Confidence score (0-1).
     */
    confidence?: number;
    language?:   Language;
    /**
     * Final transcribed text.
     *
     * Transcribed text so far.
     */
    transcript?: string;
    /**
     * End time of the last finalized word in seconds, when available.
     */
    last_word_end?: number;
    [property: string]: any;
}

/**
 * Error code.
 */
export type Code = "auth_error" | "config_error" | "rate_limit" | "provider_error";

/**
 * Synthesis configuration.
 *
 * Session configuration.
 */
export interface Config {
    /**
     * Output audio encoding format.
     *
     * Audio encoding format.
     */
    encoding?:    Encoding;
    language?:    Language;
    sample_rate?: number;
    /**
     * Speech speed multiplier.
     */
    speed?: number;
    /**
     * Enable partial transcription results.
     */
    enable_partials?: boolean;
    /**
     * Enable voice activity detection.
     */
    enable_vad?: boolean;
    [property: string]: any;
}

/**
 * Output audio encoding format.
 *
 * Audio encoding format.
 */
export type Encoding = "linear16" | "mp3" | "opus" | "mulaw" | "alaw";

/**
 * ISO-639-1 language code.
 */
export type Language = "en" | "ja" | "zh" | "de" | "hi" | "fr" | "ko" | "pt" | "it" | "es" | "id" | "nl" | "tr" | "fil" | "pl" | "sv" | "bg" | "ro" | "ar" | "cs" | "el" | "fi" | "hr" | "ms" | "sk" | "da" | "ta" | "uk" | "ru" | "hu" | "no" | "vi";

export type Type = "error" | "audio_end" | "cleared" | "flushed" | "segment_end" | "segment_start" | "audio_chunk" | "ready" | "close" | "clear" | "flush" | "text" | "init" | "final_transcript" | "utterance_end" | "partial_transcript" | "keepalive" | "finalize" | "audio";
