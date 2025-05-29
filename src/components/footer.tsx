import Link from 'next/link';
import React from 'react';

function Footer() {
	return (
		<footer className="bg-muted text-muted-foreground px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center justify-between">
			<p className="text-sm">&copy; 2024 QuantXCloud</p>
			<nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
				<Link href="/privacy" className="text-sm hover:underline" prefetch={false}>
					Privacy
				</Link>
				<Link href="/terms" className="text-sm hover:underline" prefetch={false}>
					Terms
				</Link>
				<Link href="/support" className="text-sm hover:underline" prefetch={false}>
					Support
				</Link>
			</nav>
		</footer>
	);
}

export default Footer;
