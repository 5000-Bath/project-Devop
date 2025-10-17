import { render, screen, waitFor, fireEvent } from '@testing-library/react'; // *** เพิ่ม fireEvent ***
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Swal from 'sweetalert2';
import { MemoryRouter } from 'react-router-dom';
import Additem from './AddItem';

// Mock dependencies
vi.mock('sweetalert2', () => ({
    default: {
        fire: vi.fn(),
    },
}));

const mockNavigate = vi.fn();
// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

window.URL.createObjectURL = vi.fn(() => 'mock-preview-url');

describe('Add Item Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the form for adding a new menu item', () => {
        render(<MemoryRouter><Additem /></MemoryRouter>);
        expect(screen.getByRole('heading', { name: /add new menu/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter menu name/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
    });

    it('should show a validation error if required fields are empty on submit', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch');
        // ต้องเก็บผลลัพธ์ของ render ไว้ในตัวแปรเพื่อเข้าถึง 'container'
        const { container } = render(<MemoryRouter><Additem /></MemoryRouter>); 

        // **การแก้ไข:** หา Form Element โดยใช้ QuerySelector (Tag Name)
        // เพื่อเลี่ยงปัญหา Accessible Role ที่ไม่มี Accessible Name
        const formElement = container.querySelector('form');
        
        // ตรวจสอบว่าฟอร์มถูกหาเจอจริงก่อนทำการ submit
        expect(formElement).toBeInTheDocument();

        // *** ใช้ fireEvent.submit เพื่อบังคับให้ฟอร์มส่ง Event Submit (Bypass HTML5 Validation) ***
        fireEvent.submit(formElement); 

        // ต้องใช้ waitFor เพื่อรอให้ SweetAlert/State Update ทำงาน
        await waitFor(() => {
            expect(fetchSpy).not.toHaveBeenCalled();
            expect(Swal.fire).toHaveBeenCalledWith({
                icon: 'warning',
                title: 'กรุณากรอกข้อมูลให้ครบ',
                text: 'กรุณากรอกชื่อเมนูและราคา',
                confirmButtonText: 'ตกลง'
            });
        });
    });

    it('should allow a user to fill the form and submit successfully', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ id: 1, name: 'New Mock Item' }),
        });

        render(<MemoryRouter><Additem /></MemoryRouter>);

        // Fill required fields
        await userEvent.type(screen.getByPlaceholderText(/enter menu name/i), 'Spicy Noodle');
        await userEvent.type(screen.getByPlaceholderText(/enter price/i), '80');

        // คลิกปุ่ม Submit
        await userEvent.click(screen.getByRole('button', { name: /apply/i }));

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledWith('/api/products', expect.any(Object));
            
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success' }));
            expect(mockNavigate).toHaveBeenCalledWith('/admin/menu');
        });
    });
});