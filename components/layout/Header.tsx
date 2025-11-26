import Link from 'next/link';

const Header = () => {
    return (
        <header>
            {/* Other Header Content */}
            <nav>
                <Link href="/home" className="text-xl-dark-blue hover:text-xl-bright-blue transition-colors font-medium">Home</Link>
                <Link href="/about" className="text-xl-dark-blue hover:text-xl-bright-blue transition-colors font-medium">About</Link>
                <Link href="/contact" className="text-xl-dark-blue hover:text-xl-bright-blue transition-colors font-medium">Contact</Link>
                {/* Fantasy Football Link removed */}
            </nav>
        </header>
    );
};

export default Header;