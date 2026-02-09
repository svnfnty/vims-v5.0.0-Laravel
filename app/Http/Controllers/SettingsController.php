<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\SystemInfo;

class SettingsController extends Controller
{
    public function index()
    {
        // Get system info from database
        $systemName = SystemInfo::where('meta_field', 'system_name')->value('meta_value') ?? 'VEHICLE INSURANCE MANAGEMENT SYSTEM';
        $systemShortName = SystemInfo::where('meta_field', 'system_shortname')->value('meta_value') ?? 'VIMSYS SAAS 2026';
        $logo = SystemInfo::where('meta_field', 'logo')->value('meta_value') ?? '';
        $cover = SystemInfo::where('meta_field', 'cover')->value('meta_value') ?? '';

        return view('system.settings', compact('systemName', 'systemShortName', 'logo', 'cover'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'system_name' => 'required|string|max:255',
            'system_shortname' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Update or create system_name
        SystemInfo::updateOrCreate(
            ['meta_field' => 'system_name'],
            ['meta_value' => $request->system_name]
        );

        // Update or create system_shortname
        SystemInfo::updateOrCreate(
            ['meta_field' => 'system_shortname'],
            ['meta_value' => $request->system_shortname]
        );

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('uploads', 'public');
            SystemInfo::updateOrCreate(
                ['meta_field' => 'logo'],
                ['meta_value' => $logoPath]
            );
        }

        // Handle cover upload
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('uploads', 'public');
            SystemInfo::updateOrCreate(
                ['meta_field' => 'cover'],
                ['meta_value' => $coverPath]
            );
        }

        return redirect()->route('system.settings')->with('success', 'System settings updated successfully.');
    }
}
