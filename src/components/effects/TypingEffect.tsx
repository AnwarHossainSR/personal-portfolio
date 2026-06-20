import { useEffect, useState } from "react";

interface TypingEffectProps {
	texts: string[];
	typingSpeed?: number;
	deletingSpeed?: number;
	pauseDuration?: number;
	loop?: boolean;
	className?: string;
	showCursor?: boolean;
}

export default function TypingEffect({
	texts,
	typingSpeed = 100,
	deletingSpeed = 50,
	pauseDuration = 2000,
	loop = true,
	className = "",
	showCursor = true,
}: TypingEffectProps) {
	const [displayText, setDisplayText] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	useEffect(() => {
		if (isPaused) {
			const pauseTimeout = setTimeout(() => {
				setIsPaused(false);
				setIsDeleting(true);
			}, pauseDuration);
			return () => clearTimeout(pauseTimeout);
		}

		const currentText = texts[currentIndex];
		const timeout = setTimeout(
			() => {
				if (!isDeleting) {
					// Typing
					if (displayText.length < currentText.length) {
						setDisplayText(currentText.slice(0, displayText.length + 1));
					} else {
						// Finished typing
						if (loop || currentIndex < texts.length - 1) {
							setIsPaused(true);
						}
					}
				} else {
					// Deleting
					if (displayText.length > 0) {
						setDisplayText(displayText.slice(0, -1));
					} else {
						// Finished deleting
						setIsDeleting(false);
						if (loop) {
							setCurrentIndex((currentIndex + 1) % texts.length);
						} else if (currentIndex < texts.length - 1) {
							setCurrentIndex(currentIndex + 1);
						}
					}
				}
			},
			isDeleting ? deletingSpeed : typingSpeed,
		);

		return () => clearTimeout(timeout);
	}, [
		displayText,
		currentIndex,
		isDeleting,
		isPaused,
		texts,
		typingSpeed,
		deletingSpeed,
		pauseDuration,
		loop,
	]);

	return (
		<span className={className}>
			{displayText}
			{showCursor && (
				<span className="typing-cursor animate-blink ml-1">|</span>
			)}
		</span>
	);
}
