import Link from 'next/link';
import { SVGProps } from 'react';
import { ModeToggle } from '@/components/darkmodeToggle';

export default async function Header() {
	return (
		<header className="bg-primary text-primary-foreground px-4 lg:px-6 h-14 flex items-center">
			<div className="max-w-6xl mx-auto w-full flex items-center">
				<Link href="/" className="flex items-center" prefetch={false}>
					<CloudIcon className="h-6 w-6 mr-2" />
					<span className="font-bold text-lg">
						QuantX<span className="text-red-800">Cloud</span>
					</span>
				</Link>
				<div className="ml-auto flex items-center gap-4">
					<Link
						href="/login"
						className="inline-flex h-9 items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary shadow transition-colors hover:bg-primary-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
						prefetch={false}
					>
						Login
					</Link>
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}

function CloudIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
		</svg>
	);
}
